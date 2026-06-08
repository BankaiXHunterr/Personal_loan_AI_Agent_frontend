'use client';

import { MicVAD } from '@ricky0123/vad-web';
import type { CallStatus, TranscriptLine } from './types';
import { BACKEND_URL, BACKEND_ENABLED } from './session';

export interface TransportCallbacks {
  onTranscript: (line: TranscriptLine) => void;
  onStatus: (status: CallStatus) => void;
  onClose: () => void;
}

export interface Transport {
  connect(sessionId: string, step: string, form: unknown): Promise<void>;
  sendState(step: string, form: unknown): void;
  setMuted(muted: boolean): void;
  close(): void;
}

/* ---- Tuning ----
 * Raise positiveSpeechThreshold / minSpeechFrames if it still false-triggers on noise.
 * Lower redemptionFrames if it cuts you off too soon; raise it if it ends turns late.
 */
const VAD_OPTS = {
  positiveSpeechThreshold: 0.6,   // how confident before it counts as speech (0–1)
  negativeSpeechThreshold: 0.4,   // drop below this to start counting silence
  minSpeechFrames: 4,             // ignore blips shorter than ~4 frames
  preSpeechPadFrames: 3,          // keep audio just BEFORE detection (no clipped first word)
  redemptionFrames: 12,           // ~consecutive silent frames that end your turn
};

// Pause listening while Maya talks (most reliable — she can't trigger the mic).
// Flip to true to allow interrupting her (use headphones if you do).
const BARGE_IN = false;

function encodeWAV(samples: Float32Array, sampleRate = 16000): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const str = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  str(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  str(8, 'WAVE'); str(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);            // PCM
  view.setUint16(22, 1, true);            // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);           // 16-bit
  str(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++, off += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([view], { type: 'audio/wav' });
}

class BrowserTransport implements Transport {
  private cb: TransportCallbacks;
  private ws: WebSocket | null = null;
  private vad: MicVAD | null = null;
  private muted = false;
  private speaking = false;     // Maya is playing
  private agentDone = true;
  private queue: ArrayBuffer[] = [];
  private playing = false;
  private current: HTMLAudioElement | null = null;

  constructor(cb: TransportCallbacks) { this.cb = cb; }

  async connect(sessionId: string, step: string, form: unknown) {
    if (!BACKEND_ENABLED) { this.cb.onStatus('error'); return; }
    this.cb.onStatus('connecting');

    // Silero VAD owns the mic + audio processing.
    this.vad = await MicVAD.new({
      ...VAD_OPTS,
      baseAssetPath: 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/',
      onnxWASMBasePath: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/',
      onSpeechStart: () => {
        if (BARGE_IN && this.playing) this.stopPlayback();
      },
      onSpeechEnd: (audio: Float32Array) => {
        if (this.speaking && !BARGE_IN) return;     // ignore Maya's own audio
        if (this.ws?.readyState !== WebSocket.OPEN) return;
        this.agentDone = false;
        this.cb.onStatus('thinking');
        encodeWAV(audio).arrayBuffer().then((b) => this.ws?.send(b));
      },
      onVADMisfire: () => { /* too short to be speech — ignore */ },
    });

    const base = BACKEND_URL.replace(/^http/, 'ws');
    this.ws = new WebSocket(`${base}/ws/${sessionId}`);
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      this.send({ type: 'state_sync', step, form });
      this.send({ type: 'call_start' });   // Maya greets first
      this.speaking = true;
      this.agentDone = false;
      this.cb.onStatus('thinking');
      if (BARGE_IN) this.vad?.start();      // otherwise we start listening after she greets
    };

    this.ws.onmessage = (ev) => {
      if (typeof ev.data !== 'string') { this.enqueue(ev.data as ArrayBuffer); return; }
      const msg = JSON.parse(ev.data);
      if (msg.type === 'transcript') this.cb.onTranscript({ role: msg.role, text: msg.text });
      else if (msg.type === 'assistant_done') { this.agentDone = true; if (!this.playing) this.listen(); }
    };
    this.ws.onclose = () => this.cb.onClose();
    this.ws.onerror = () => this.cb.onStatus('error');
  }

  private send(obj: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(obj));
  }

  sendState(step: string, form: unknown) { this.send({ type: 'state_sync', step, form }); }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) this.vad?.pause();
    else if (!this.speaking) this.vad?.start();
  }

  private listen() {
    this.speaking = false;
    this.cb.onStatus('listening');
    if (!this.muted) this.vad?.start();
  }

  private enqueue(buf: ArrayBuffer) {
    this.speaking = true;
    this.cb.onStatus('speaking');
    if (!BARGE_IN) this.vad?.pause();   // don't transcribe Maya
    this.queue.push(buf);
    if (!this.playing) this.playNext();
  }

  private playNext() {
    const buf = this.queue.shift();
    if (!buf) {
      this.playing = false;
      if (this.agentDone) this.listen();
      return;
    }
    this.playing = true;
    const url = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
    const audio = new Audio(url);
    this.current = audio;
    const done = () => { URL.revokeObjectURL(url); this.current = null; this.playNext(); };
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch(() => done());
  }

  private stopPlayback() {
    if (this.current) { this.current.pause(); this.current = null; }
    this.queue = [];
    this.playing = false;
    this.agentDone = true;
  }

  close() {
    this.stopPlayback();
    this.vad?.destroy();
    this.vad = null;
    if (this.ws?.readyState === WebSocket.OPEN) { this.send({ type: 'call_end' }); this.ws.close(); }
    this.ws = null;
    this.speaking = false;
  }
}

class PhoneTransport implements Transport {
  async connect() {}
  sendState() {}
  setMuted() {}
  close() {}
}

export function createTransport(kind: 'browser' | 'phone', cb: TransportCallbacks): Transport {
  return kind === 'phone' ? new PhoneTransport() : new BrowserTransport(cb);
}
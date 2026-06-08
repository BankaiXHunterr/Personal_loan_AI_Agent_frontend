'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CallState, CallStatus, FormData, TranscriptLine } from './types';
import { createTransport, type Transport } from './voiceTransport';

interface Args {
  sessionId: string | null;
  callState: CallState;
  step: string;
  form: FormData;
  onClose: () => void;
}

export function useVoiceCall({ sessionId, callState, step, form, onClose }: Args) {
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [status, setStatus] = useState<CallStatus>('idle');
  const [muted, setMuted] = useState(false);
  const transportRef = useRef<Transport | null>(null);

  // Keep the latest step/form in refs so the connect effect can read fresh values
  // at connect time WITHOUT listing them as deps (which would reconnect on every
  // keystroke). Updated in an effect, not during render. Declared before the
  // connect effect so the refs are current when a call starts on the same commit.
  const stepRef = useRef(step);
  const formRef = useRef(form);
  useEffect(() => {
    stepRef.current = step;
    formRef.current = form;
  }, [step, form]);

  useEffect(() => {
    if (callState !== 'active' || !sessionId) return;
    const t = createTransport('browser', {
      onTranscript: (line) => setTranscript((prev) => [...prev, line]),
      onStatus: setStatus,
      onClose,
    });
    transportRef.current = t;
    t.connect(sessionId, stepRef.current, formRef.current).catch(() => setStatus('error'));
    return () => {
      t.close();
      transportRef.current = null;
      // Reset on teardown so the next call starts fresh (cleanup setState is fine).
      setStatus('idle');
      setTranscript([]);
      setMuted(false);
    };
  }, [callState, sessionId, onClose]);

  useEffect(() => {
    transportRef.current?.sendState(step, form);
  }, [step, form]);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      transportRef.current?.setMuted(next);
      return next;
    });
  }, []);

  return { transcript, status, muted, toggleMute };
}
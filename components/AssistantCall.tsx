'use client';

import { useEffect, useRef } from 'react';
import { PhoneCall, PhoneOff, Sparkles, Mic, MicOff } from 'lucide-react';
import { STEPS, CONTEXT_LINE } from '@/lib/steps';
import type { CallState, CallStatus, StepId, TranscriptLine } from '@/lib/types';

interface Props {
  callState: CallState;
  step: number;
  currentId: StepId;
  callSecs: number;
  transcript: TranscriptLine[];
  status: CallStatus;
  muted: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
}

const STATUS_TEXT: Record<CallStatus, string> = {
  idle: '',
  connecting: 'Connecting…',
  listening: 'Listening — just speak',
  thinking: 'Thinking…',
  speaking: 'Maya is speaking…',
  error: 'Connection issue — is the backend running?',
};

export function AssistantCall({
  callState, step, currentId, callSecs, transcript, status, muted,
  onAccept, onDecline, onEnd, onToggleMute,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [transcript, status]);

  if (callState === 'none') return null;

  const mmss = `${String(Math.floor(callSecs / 60)).padStart(2, '0')}:${String(callSecs % 60).padStart(2, '0')}`;
  const live = status === 'listening' || status === 'speaking';

  return (
    <div className="call-dock">
      {callState === 'incoming' ? (
        <div className="call-card">
          <div className="orb"><span className="ring" /><span className="ring r2" /><PhoneCall size={26} /></div>
          <p className="call-name">AI Assistant</p>
          <p className="call-status">Incoming call…</p>
          <p className="call-ctx">{CONTEXT_LINE[currentId]}</p>
          <div className="call-btns">
            <button className="cbtn decline" onClick={onDecline}><PhoneOff size={20} /></button>
            <button className="cbtn accept" onClick={onAccept}><PhoneCall size={20} /></button>
          </div>
          <p className="call-hint">You paused for a moment — your assistant can help you finish.</p>
        </div>
      ) : (
        <div className="call-card active">
          <div className="incall-top">
            <div className="orb sm"><span className="ring" /><PhoneCall size={18} /></div>
            <div>
              <p className="call-name">AI Assistant</p>
              <p className="call-timer">On call · {mmss}</p>
            </div>
            <span className="live-dot" />
          </div>

          <div className="ctx-banner">
            <Sparkles size={13} /> Viewing your application — <b>{STEPS[step].label}</b>
          </div>

          <div className={`wave ${status === 'speaking' ? 'on' : ''}`}>
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.09}s`, animationPlayState: live ? 'running' : 'paused' }} />
            ))}
          </div>

          <p className="call-status-line">{STATUS_TEXT[status]}</p>

          <div className="transcript" ref={scrollRef}>
            {transcript.length === 0 ? (
              <div className="bubble ai"><span className="who">Assistant</span>{CONTEXT_LINE[currentId]}</div>
            ) : (
              transcript.map((line, i) => (
                <div key={i} className={`bubble ${line.role === 'assistant' ? 'ai' : 'me'}`}>
                  <span className="who">{line.role === 'assistant' ? 'Assistant' : 'You'}</span>
                  {line.text}
                </div>
              ))
            )}
          </div>

          <div className="call-actions">
            <button className={`mute-btn ${muted ? 'on' : ''}`} onClick={onToggleMute}>
              {muted ? <MicOff size={16} /> : <Mic size={16} />} {muted ? 'Muted' : 'Mute'}
            </button>
            <button className="cbtn end" onClick={onEnd}><PhoneOff size={16} /> End call</button>
          </div>
        </div>
      )}
    </div>
  );
}
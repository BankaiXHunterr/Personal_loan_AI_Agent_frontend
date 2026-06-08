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

  const stepRef = useRef(step); stepRef.current = step;
  const formRef = useRef(form); formRef.current = form;

  useEffect(() => {
    if (callState !== 'active' || !sessionId) return;
    setTranscript([]);
    setMuted(false);
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
      setStatus('idle');
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
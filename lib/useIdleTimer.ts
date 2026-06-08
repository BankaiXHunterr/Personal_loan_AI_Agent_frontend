'use client';

import { useEffect } from 'react';

export interface IdleTimerOptions {
  enabled?: boolean;
  onStuck: () => void;
}

export function useIdleTimer(
  ms: number,
  { enabled = true, onStuck }: IdleTimerOptions,
): void {
  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const arm = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => onStuck(), ms);
    };
    arm();
    window.addEventListener('pointerdown', arm);
    window.addEventListener('keydown', arm);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('pointerdown', arm);
      window.removeEventListener('keydown', arm);
    };
  }, [ms, enabled, onStuck]);
}

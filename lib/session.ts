// import type { FormData, StepId } from './types';

// export const BACKEND_ENABLED = Boolean(
//   process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL.length > 0,
// );

// export interface SessionState {
//   step: StepId;
//   formData: Partial<FormData>;
// }

// export async function syncState(
//   sessionId: string,
//   partial: SessionState,
// ): Promise<void> {
//   if (!BACKEND_ENABLED) {
//     if (typeof window !== 'undefined') {
//       console.debug('[session.syncState stub]', sessionId, partial);
//     }
//     return;
//   }
//   // TODO(backend): POST /session/state with { sessionId, ...partial }
//   // const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/session/state`;
//   // await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' },
//   //   body: JSON.stringify({ sessionId, ...partial }) });
// }



// Backend connection helpers.
//
// State sync used to be an HTTP POST stub. It now travels over the single
// WebSocket the voice call opens (see voiceTransport.ts + useVoiceCall.ts),
// so this file just centralises the URL handling.

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
export const BACKEND_ENABLED = BACKEND_URL.length > 0;

/** Build the ws(s):// URL for a session, accepting an http(s) or ws(s) base. */
export function wsUrl(sessionId: string): string {
  const base = BACKEND_URL.replace(/^http/, 'ws').replace(/\/+$/, '');
  return `${base}/ws/${sessionId}`;
}
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

import type { FormData } from './types';
import { normaliseMobile } from './validation';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';
export const BACKEND_ENABLED = BACKEND_URL.length > 0;

/** Build the ws(s):// URL for a session, accepting an http(s) or ws(s) base. */
export function wsUrl(sessionId: string): string {
  const base = BACKEND_URL.replace(/^http/, 'ws').replace(/\/+$/, '');
  return `${base}/ws/${sessionId}`;
}

// ---- Applicant tracking (phone = identity) --------------------------------
// All persistence is backend-mediated; these are thin REST calls. Every helper
// is best-effort: if the backend is disabled or unreachable it resolves quietly
// so the form never breaks because of a network blip.

export interface ApplicantRecord {
  phone: string;
  full_name: string | null;
  step: string | null;            // saved step id, e.g. "bank"
  form: Partial<FormData>;
  status: string | null;
}

const httpBase = () => BACKEND_URL.replace(/\/+$/, '');

/** Look up a saved applicant by phone for resume. Null if unknown/unreachable. */
export async function getApplicant(phone: string): Promise<ApplicantRecord | null> {
  const key = normaliseMobile(phone);
  if (!BACKEND_ENABLED || !key) return null;
  try {
    const res = await fetch(`${httpBase()}/applicant/${encodeURIComponent(key)}`);
    if (!res.ok) return null;            // 404 (new user) included
    return (await res.json()) as ApplicantRecord;
  } catch {
    return null;
  }
}

/** Register / refresh an applicant when they accept the offer. */
export async function registerApplicant(phone: string, fullName: string): Promise<void> {
  const key = normaliseMobile(phone);
  if (!BACKEND_ENABLED || !key) return;
  try {
    await fetch(`${httpBase()}/applicant`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone: key, full_name: fullName }),
    });
  } catch {
    /* best-effort */
  }
}

/** Persist the user's current step + form as they fill it in (not just during a
 *  call), so a returning applicant resumes exactly where they left off. */
export async function saveProgress(
  phone: string,
  step: string,
  form: Partial<FormData>,
): Promise<void> {
  const key = normaliseMobile(phone);
  if (!BACKEND_ENABLED || !key) return;
  try {
    await fetch(`${httpBase()}/applicant/${encodeURIComponent(key)}/progress`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ step, form }),
    });
  } catch {
    /* best-effort */
  }
}

/** Flag that the user left the page mid-application (used on pagehide). */
export function markLeft(phone: string): void {
  const key = normaliseMobile(phone);
  if (!BACKEND_ENABLED || !key) return;
  const url = `${httpBase()}/applicant/${encodeURIComponent(key)}/left`;
  try {
    // sendBeacon survives the page being torn down; fetch+keepalive is the fallback.
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      void fetch(url, { method: 'POST', keepalive: true });
    }
  } catch {
    /* best-effort on unload */
  }
}
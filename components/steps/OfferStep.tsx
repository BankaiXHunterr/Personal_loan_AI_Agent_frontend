'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { CAP, RATE } from '@/lib/steps';
import { formatINR } from '@/lib/format';
import { isValidMobile, isValidName } from '@/lib/validation';
import type { FormData } from '@/lib/types';
import { StepHead, Field } from './primitives';

type SetField = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

interface Props {
  data: FormData;
  emi: number;
  set: SetField;
  resumeLabel?: string | null;   // set when a returning user is recognised
  onResume?: () => void;
}

export function OfferStep({ data, emi, set, resumeLabel, onResume }: Props) {
  // Only surface a validation hint once the user has left the field, so the form
  // doesn't shout "invalid" before they've typed anything.
  const [touched, setTouched] = useState<{ name?: boolean; mobile?: boolean }>({});
  const nameBad = touched.name && !isValidName(data.fullName);
  const mobileBad = touched.mobile && !isValidMobile(data.mobile);

  return (
    <div className="anim">
      <StepHead kicker="Congratulations" title="You’re preapproved" />
      <div className="offer">
        <div className="offer-main">
          <p className="offer-k">Available to you, up to</p>
          <p className="offer-amt">{formatINR(CAP)}</p>
          <p className="offer-sub">at {RATE}% p.a. · no paperwork to qualify</p>
        </div>
        <ul className="offer-list">
          <li><Check size={15} /> Instant decision, funds in 24 hours</li>
          <li><Check size={15} /> Flexible tenure from 6 to 60 months</li>
          <li><Check size={15} /> No prepayment penalty, ever</li>
          <li><Check size={15} /> Your live AI assistant on every step</li>
        </ul>
      </div>

      <p className="micro">
        Selected: {formatINR(data.amount)} · est. EMI {formatINR(emi)}/mo. You can change this next.
      </p>

      <div className="grid2" style={{ marginTop: 18 }}>
        <Field label="Full name" hint={nameBad ? 'Please enter your name as per PAN.' : undefined}>
          <input
            value={data.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="As per PAN card"
          />
        </Field>
        <Field label="Mobile" hint={mobileBad ? 'Enter a valid 10-digit Indian mobile.' : 'We use this to save and resume your application.'}>
          <input
            value={data.mobile}
            onChange={(e) => set('mobile', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
            placeholder="+91 98765 43210"
            inputMode="tel"
          />
        </Field>
      </div>

      {resumeLabel && onResume && (
        <button type="button" className="resume-note" onClick={onResume}>
          Welcome back — pick up where you left off ({resumeLabel}) →
        </button>
      )}
    </div>
  );
}

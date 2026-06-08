import { Check } from 'lucide-react';
import { CAP, RATE } from '@/lib/steps';
import { formatINR } from '@/lib/format';
import type { FormData } from '@/lib/types';
import { StepHead } from './primitives';

interface Props {
  data: FormData;
  emi: number;
}

export function OfferStep({ data, emi }: Props) {
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
    </div>
  );
}

import { Wallet, Percent, CalendarClock } from 'lucide-react';
import { CAP, FLOOR, RATE } from '@/lib/steps';
import { formatINR } from '@/lib/format';
import type { FormData } from '@/lib/types';
import { StepHead, Field } from './primitives';

type SetField = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

interface Props {
  data: FormData;
  set: SetField;
  emi: number;
  total: number;
}

const PURPOSES = [
  'Home renovation',
  'Medical',
  'Education',
  'Travel',
  'Debt consolidation',
  'Wedding',
  'Other',
];

export function LoanStep({ data, set, emi, total }: Props) {
  const pct = ((data.amount - FLOOR) / (CAP - FLOOR)) * 100;
  return (
    <div className="anim">
      <StepHead
        kicker="Loan details"
        title="How much do you need?"
        lead="Move the slider and watch your monthly EMI update in real time."
      />
      <div className="amt-display">{formatINR(data.amount)}</div>
      <input
        type="range"
        min={FLOOR}
        max={CAP}
        step={10000}
        value={data.amount}
        onChange={(e) => set('amount', +e.target.value)}
        className="slider"
        style={{
          background: `linear-gradient(90deg, var(--green) ${pct}%, var(--line) ${pct}%)`,
        }}
      />
      <div className="slider-ends">
        <span>{formatINR(FLOOR)}</span>
        <span>{formatINR(CAP)}</span>
      </div>

      <div className="grid2">
        <Field label="Tenure">
          <div className="chips">
            {[12, 24, 36, 48, 60].map((t) => (
              <button
                key={t}
                className={`chip ${data.tenure === t ? 'on' : ''}`}
                onClick={() => set('tenure', t)}
              >
                {t} mo
              </button>
            ))}
          </div>
        </Field>
        <Field label="Purpose of loan">
          <select value={data.purpose} onChange={(e) => set('purpose', e.target.value)}>
            {PURPOSES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
      </div>

      <div className="emi-card">
        <div><Wallet size={16} /><span>Monthly EMI</span><b>{formatINR(emi)}</b></div>
        <div><Percent size={16} /><span>Interest rate</span><b>{RATE}% p.a.</b></div>
        <div><CalendarClock size={16} /><span>Total payable</span><b>{formatINR(total)}</b></div>
      </div>
    </div>
  );
}

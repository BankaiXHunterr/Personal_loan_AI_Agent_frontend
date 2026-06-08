import type { FormData } from '@/lib/types';
import { StepHead, Field } from './primitives';

type SetField = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

interface Props {
  data: FormData;
  set: SetField;
}

const TYPES = ['Salaried', 'Self-employed', 'Business owner', 'Professional'];

export function EmploymentStep({ data, set }: Props) {
  return (
    <div className="anim">
      <StepHead
        kicker="Employment & income"
        title="Your income details"
        lead="We use this to confirm your eligibility and set your limit."
      />
      <Field label="Employment type" full>
        <div className="chips">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`chip ${data.employment === t ? 'on' : ''}`}
              onClick={() => set('employment', t)}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>
      <div className="grid2">
        <Field label="Employer / business name" full>
          <input
            value={data.employer}
            onChange={(e) => set('employer', e.target.value)}
            placeholder="Where you work"
          />
        </Field>
        <Field label="Net monthly income" hint="Take-home, after deductions">
          <input
            value={data.income}
            onChange={(e) => set('income', e.target.value)}
            placeholder="₹ 85,000"
          />
        </Field>
      </div>
    </div>
  );
}

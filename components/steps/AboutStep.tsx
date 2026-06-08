import type { FormData } from '@/lib/types';
import { StepHead, Field } from './primitives';

type SetField = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

interface Props {
  data: FormData;
  set: SetField;
}

export function AboutStep({ data, set }: Props) {
  return (
    <div className="anim">
      <StepHead
        kicker="About you"
        title="Tell us who you are"
        lead="This must match your PAN exactly so we can verify instantly."
      />
      <div className="grid2">
        <Field label="Full name" full>
          <input
            value={data.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="As per PAN card"
          />
        </Field>
        <Field label="Date of birth">
          <input type="date" value={data.dob} onChange={(e) => set('dob', e.target.value)} />
        </Field>
        <Field label="PAN" hint="10-character permanent account number">
          <input
            value={data.pan}
            onChange={(e) => set('pan', e.target.value.toUpperCase())}
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={data.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@email.com"
          />
        </Field>
        <Field label="Mobile">
          <input
            value={data.mobile}
            onChange={(e) => set('mobile', e.target.value)}
            placeholder="+91 98765 43210"
          />
        </Field>
      </div>
    </div>
  );
}

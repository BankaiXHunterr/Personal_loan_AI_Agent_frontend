import type { FormData } from '@/lib/types';
import { StepHead, Field } from './primitives';

type SetField = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

interface Props {
  data: FormData;
  set: SetField;
}

export function BankStep({ data, set }: Props) {
  return (
    <div className="anim">
      <StepHead
        kicker="Bank account"
        title="Where should we send the money?"
        lead="Your loan is disbursed to this account, usually within 24 hours."
      />
      <div className="grid2">
        <Field label="Account holder name" full>
          <input
            value={data.accName}
            onChange={(e) => set('accName', e.target.value)}
            placeholder="As per bank records"
          />
        </Field>
        <Field label="Account number">
          <input
            value={data.accNumber}
            onChange={(e) => set('accNumber', e.target.value)}
            placeholder="000123456789"
          />
        </Field>
        <Field label="IFSC code" hint="Found on your cheque or bank app">
          <input
            value={data.ifsc}
            onChange={(e) => set('ifsc', e.target.value.toUpperCase())}
            placeholder="HDFC0001234"
            maxLength={11}
          />
        </Field>
      </div>
    </div>
  );
}

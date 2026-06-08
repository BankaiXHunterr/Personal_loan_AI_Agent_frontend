import { Check, Pencil } from 'lucide-react';
import { formatINR } from '@/lib/format';
import type { FormData } from '@/lib/types';
import { StepHead } from './primitives';

type SetField = <K extends keyof FormData>(k: K, v: FormData[K]) => void;

interface Props {
  data: FormData;
  set: SetField;
  emi: number;
  otp: string[];
  setOtp: (next: string[]) => void;
  go: (i: number) => void;
}

export function ReviewStep({ data, set, emi, otp, setOtp, go }: Props) {
  const rows: [string, string, number][] = [
    ['Loan amount', formatINR(data.amount), 1],
    ['Tenure', `${data.tenure} months`, 1],
    ['Monthly EMI', formatINR(emi), 1],
    ['Name', data.fullName || '—', 2],
    ['PAN', data.pan || '—', 2],
    ['Employer', data.employer || '—', 3],
    [
      'Disbursal account',
      data.accNumber ? `••••${data.accNumber.slice(-4)}` : '—',
      4,
    ],
  ];

  const setDigit = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp];
    n[i] = v;
    setOtp(n);
  };

  return (
    <div className="anim">
      <StepHead
        kicker="Review & sign"
        title="Confirm and verify"
        lead="Check everything looks right, then verify with the OTP we’ve sent."
      />
      <div className="review">
        {rows.map(([k, v, s]) => (
          <div className="rrow" key={k}>
            <span>{k}</span>
            <b>{v}</b>
            <button className="edit" onClick={() => go(s)}>
              <Pencil size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="otp-zone">
        <p className="otp-label">
          Enter the 4-digit code sent to {data.mobile || 'your mobile'}
        </p>
        <div className="otp">
          {otp.map((d, i) => (
            <input
              key={i}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>
      </div>

      <label className="consent" onClick={() => set('consent', !data.consent)}>
        <span className="cbox" data-checked={data.consent}>
          {data.consent && <Check size={13} color="#fff" />}
        </span>
        <span className="ctext">
          I agree to the <a>loan agreement</a>, <a>terms of service</a> and authorise Aspen to verify my details.
        </span>
      </label>
    </div>
  );
}

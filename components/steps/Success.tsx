import { Check } from 'lucide-react';
import { formatINR } from '@/lib/format';
import type { FormData } from '@/lib/types';

interface Props {
  data: FormData;
  emi: number;
}

export function Success({ data, emi }: Props) {
  return (
    <div className="success anim">
      <div className="suc-orb"><Check size={34} /></div>
      <p className="sh-kicker">All done</p>
      <h1 className="sh-title">Your application is in</h1>
      <p className="sh-lead">
        We’re reviewing it now. You’ll hear from us within a few hours — and your AI assistant is here if you need anything.
      </p>
      <div className="suc-card">
        <div><span>Application ID</span><b>ASP-2K6F-9183</b></div>
        <div><span>Amount</span><b>{formatINR(data.amount)}</b></div>
        <div><span>Monthly EMI</span><b>{formatINR(emi)}</b></div>
        <div><span>Status</span><b className="pill">Under review</b></div>
      </div>
    </div>
  );
}

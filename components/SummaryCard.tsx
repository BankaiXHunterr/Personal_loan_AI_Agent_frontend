import { RATE } from '@/lib/steps';
import { formatINR } from '@/lib/format';

interface Props {
  amount: number;
  tenure: number;
  emi: number;
}

export function SummaryCard({ amount, tenure, emi }: Props) {
  return (
    <div className="summary">
      <p className="sum-kicker">Loan summary</p>
      <p className="sum-amt">{formatINR(amount)}</p>
      <div className="sum-grid">
        <div><span>Tenure</span><b>{tenure} mo</b></div>
        <div><span>Rate</span><b>{RATE}% p.a.</b></div>
        <div className="sum-emi"><span>Monthly EMI</span><b>{formatINR(emi)}</b></div>
      </div>
    </div>
  );
}

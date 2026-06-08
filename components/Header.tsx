import { Lock } from 'lucide-react';
import { STEPS } from '@/lib/steps';

interface Props {
  step: number;
}

export function Header({ step }: Props) {
  return (
    <header className="hdr">
      <div className="brand">
        <span className="logo"><span className="logo-mark" /></span>
        <span className="brand-name">Mahindra Finance</span>
        <span className="brand-tag">personal loans</span>
      </div>
      <div className="hdr-right">
        <span className="secure"><Lock size={13} /> 256-bit secured</span>
        <span className="step-count">Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}</span>
      </div>
    </header>
  );
}

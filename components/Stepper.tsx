import { Check } from 'lucide-react';
import { STEPS } from '@/lib/steps';

interface Props {
  step: number;
  done: boolean;
  onJump: (i: number) => void;
}

export function Stepper({ step, done, onJump }: Props) {
  return (
    <ol className="stepper">
      {STEPS.map((s, i) => {
        const state = done || i < step ? 'done' : i === step ? 'current' : 'todo';
        const Icon = s.icon;
        return (
          <li
            key={s.id}
            className={`stp ${state}`}
            onClick={() => i <= step && onJump(i)}
          >
            <span className="node">
              {state === 'done' ? <Check size={14} /> : <Icon size={14} />}
            </span>
            <span className="stp-txt">
              <span className="stp-label">{s.label}</span>
              <span className="stp-sub">{s.sub}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

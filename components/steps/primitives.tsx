import type { ReactNode } from 'react';

interface StepHeadProps {
  kicker: string;
  title: string;
  lead?: string;
}

export function StepHead({ kicker, title, lead }: StepHeadProps) {
  return (
    <div className="sh">
      <p className="sh-kicker">{kicker}</p>
      <h1 className="sh-title">{title}</h1>
      {lead && <p className="sh-lead">{lead}</p>}
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  full?: boolean;
  children: ReactNode;
}

export function Field({ label, hint, children, full }: FieldProps) {
  return (
    <label className={`field ${full ? 'full' : ''}`}>
      <span className="flabel">{label}</span>
      {children}
      {hint && <span className="fhint">{hint}</span>}
    </label>
  );
}

import { Upload } from 'lucide-react';
import { StepHead } from './primitives';

const DOCS = [
  { t: 'Identity proof', s: 'Aadhaar, Passport or Voter ID' },
  { t: 'Income proof', s: 'Last 3 months’ salary slips' },
  { t: 'Bank statement', s: 'Last 6 months (PDF)' },
];

export function DocumentsStep() {
  return (
    <div className="anim">
      <StepHead
        kicker="Documents"
        title="A few quick uploads"
        lead="Drag and drop, or browse. Most are auto-verified in seconds."
      />
      <div className="drops">
        {DOCS.map((d) => (
          <div className="drop" key={d.t}>
            <Upload size={20} />
            <p className="drop-t">{d.t}</p>
            <p className="drop-s">{d.s}</p>
            <span className="drop-btn">Browse files</span>
          </div>
        ))}
      </div>
    </div>
  );
}

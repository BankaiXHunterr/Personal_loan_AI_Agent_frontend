import {
  Sparkles,
  Wallet,
  User,
  Briefcase,
  Landmark,
  FileText,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react';
import type { StepId } from './types';

export interface StepDef {
  id: StepId;
  label: string;
  sub: string;
  icon: LucideIcon;
}

export const STEPS: StepDef[] = [
  { id: 'offer',      label: 'Your offer',     sub: 'Preapproved',      icon: Sparkles },
  { id: 'about',      label: 'About you',      sub: 'Personal details', icon: User },
  { id: 'loan',       label: 'Loan details',   sub: 'Amount & tenure',  icon: Wallet },
  { id: 'employment', label: 'Employment',     sub: 'Income details',   icon: Briefcase },
  { id: 'bank',       label: 'Bank account',   sub: 'For disbursal',    icon: Landmark },
  { id: 'documents',  label: 'Documents',      sub: 'Quick upload',     icon: FileText },
  { id: 'review',     label: 'Review & sign',  sub: 'Confirm & verify', icon: BadgeCheck },
];

export const CAP = 500000;
export const FLOOR = 50000;
export const RATE = 11.99;

export const CONTEXT_LINE: Record<StepId, string> = {
  offer: 'I can walk you through your preapproved offer.',
  loan: 'Need help choosing an amount or tenure that fits your budget?',
  about: 'I can help if anything in your personal details is unclear.',
  employment: 'Not sure how to enter your income? I can guide you.',
  bank: 'I can help you find your IFSC or sort out account details.',
  documents: 'Stuck on uploads? I can tell you exactly what we accept.',
  review: 'Almost done — I can answer any last questions before you sign.',
};

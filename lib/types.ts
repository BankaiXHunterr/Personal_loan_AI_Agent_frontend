// export type StepId =
//   | 'offer'
//   | 'loan'
//   | 'about'
//   | 'employment'
//   | 'bank'
//   | 'documents'
//   | 'review';

// export type CallState = 'none' | 'incoming' | 'active';

// export interface FormData {
//   amount: number;
//   tenure: number;
//   purpose: string;
//   fullName: string;
//   dob: string;
//   pan: string;
//   email: string;
//   mobile: string;
//   employment: string;
//   employer: string;
//   income: string;
//   accName: string;
//   accNumber: string;
//   ifsc: string;
//   consent: boolean;
// }




export type StepId =
  | 'offer'
  | 'loan'
  | 'about'
  | 'employment'
  | 'bank'
  | 'documents'
  | 'review';

export type CallState = 'none' | 'incoming' | 'active';

// Live connection status during a call (drives the status line in the call UI).
export type CallStatus = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

// One line of the live transcript shown in the call panel.
export interface TranscriptLine {
  role: 'user' | 'assistant';
  text: string;
}

export interface FormData {
  amount: number;
  tenure: number;
  purpose: string;
  fullName: string;
  dob: string;
  pan: string;
  email: string;
  mobile: string;
  employment: string;
  employer: string;
  income: string;
  accName: string;
  accNumber: string;
  ifsc: string;
  consent: boolean;
}
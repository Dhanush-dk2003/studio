
export interface CallDetailRecord {
  id: string;
  date: string;
  time: string;
  language: string;
  clid: string; // Calling Line Identification
  nssfNumber: string;
  nssfMobile: string;
  duration: string;
  callType: 'Inbound' | 'Outbound' | 'Internal';
  status: 'Answered' | 'Missed' | 'Voicemail';
  agentName?: string; // Optional
  transferVDN?: string; // Optional, VDN = Vector Directory Number
  exitMenu?: string; // Optional, e.g., 'Option 1', 'Operator'
}

export interface SummaryData {
  group: string; // e.g., '2024-07-15' or 'English'
  totalCalls: number;
  averageDuration: string; // e.g., '3m 15s'
  answeredCalls: number;
  missedCalls: number;
}

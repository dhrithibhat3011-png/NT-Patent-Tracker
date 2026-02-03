export enum PatentCategory {
  CORE = 'Core',
  NON_CORE = 'Non-Core'
}

export enum PatentType {
  PROVISIONAL = 'Provisional',
  NON_PROVISIONAL = 'Non-Provisional',
  NA = 'N/A'
}

export enum Jurisdiction {
  INDIA = 'India',
  US = 'US',
  UK = 'UK',
  PCT = 'PCT',
  EUROPE = 'Europe'
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  STARTED = 'Started',
  WAITING_ARCTIC = 'Waiting for confirmation from Arctic',
  WIP = 'Work in progress',
  COMPLETED = 'Completed',
  DELAYED = 'Delayed',
  OBJECTION = 'Objection'
}

export enum UserRole {
  NT = 'NT (Internal)',
  ARCTIC = 'Arctic (External)'
}

export interface Stage {
  id: string;
  name: string;
  status: TaskStatus;
  completedAt?: string;
  slaDeadline: string;
  poc: string;
  remarks?: string;
  updatedBy: UserRole;
  isMandatory: boolean;
  officialFees?: number;
  feePurpose?: string;
  feeDate?: string;
  description?: string;
}

export interface Patent {
  id: string;
  refId: string;
  title: string;
  category: PatentCategory;
  type: PatentType;
  jurisdictions: Jurisdiction[];
  currentStageId: string;
  stages: Stage[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  autoSummary?: string;
}

export type ViewMode = 'Home' | 'Portfolio' | 'History' | 'Analytics' | 'Settings';
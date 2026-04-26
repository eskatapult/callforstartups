export type ReviewMode = "api" | "heuristic";
export type ReviewStrictness = "lenient" | "standard" | "strict";
export type ReviewKind = "ok" | "weak" | "missing";

export interface DeckAttachment {
  file: File | null; // null when restored from localStorage or demo data
  name: string;
  size: number;
  type: string;
}

export interface FormState {
  contactName: string;
  contactEmail: string;
  contactRole: string;
  companyName: string;
  website: string;
  country: string;
  stage: string;
  teamSize: string;
  funding: string;
  problem: string;
  solution: string;
  framework: string;
  deck: DeckAttachment | null;
}

export interface ReviewFlag {
  field: string;
  kind: ReviewKind;
  msg: string;
  suggestion?: string;
}

export interface ReviewResult {
  score: number;
  summary: string;
  flags: ReviewFlag[];
  threshold: number;
  passed: boolean;
}

export interface AppConfig {
  reviewMode: ReviewMode;
  reviewStrictness: ReviewStrictness;
  anthropicModel: string;
  maxDeckSizeMb: number;
  submissionsEmail: string;
  emailFrom: string;
}

export interface ClientConfig {
  reviewMode: ReviewMode;
  reviewStrictness: ReviewStrictness;
  maxDeckSizeMb: number;
}

export type ReviewState =
  | { loading: true; status: string }
  | { result: ReviewResult }
  | { submitted: true; ref: string; score: number; time: string };

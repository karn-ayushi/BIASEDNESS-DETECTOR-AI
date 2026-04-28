/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Step = 'biased' | 'detection' | 'mitigation' | 'compare';

export interface User {
  username: string;
  email: string;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type Region = 'Urban' | 'Rural' | 'Suburban';
export type AgeGroup = '18-25' | '26-40' | '41-60' | '60+';
export type Education = 'UG' | 'PG';

export interface Candidate {
  id: string;
  name: string;
  gender: Gender;
  region: Region;
  ageGroup: AgeGroup;
  education: Education;
  skills: number; // 0-100 score
  experience: number; // years
  score?: number;
  selected?: boolean;
  wasSelectedInBiased?: boolean; // For comparison
}

export interface AttributeMetrics {
  attributeName: string;
  groups: {
    name: string;
    selectionRate: number;
    count: number;
    selectedCount: number;
  }[];
  impactRatio: number; // (min rate / max rate) or specific comparison
  biasDetected: boolean;
  disadvantagedGroup: string;
}

export interface FairnessAnalysis {
  overall: {
    total: number;
    selected: number;
    selectionRate: number;
    fairnessScore: number; // 0-100
  };
  attributes: Record<string, AttributeMetrics>;
  anyBiasDetected: boolean;
}

export interface AuditReport {
  timestamp: string;
  anyBiasDetected: boolean;
  summary: string;
  actionTaken: string;
  analysis: FairnessAnalysis;
}

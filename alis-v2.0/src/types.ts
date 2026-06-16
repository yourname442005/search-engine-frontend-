/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ResourceType = 'book' | 'paper' | 'thesis' | 'journal';
export type AccessLevel = 'Public' | 'Restricted' | 'Institutional';

export interface AcademicResource {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: ResourceType;
  relevanceScore?: number; // percentage eg. 98
  confidenceIndicator?: number; // percentage eg. 95
  abstract: string;
  doi: string;
  department: string;
  availability: boolean;
  accessLevel: AccessLevel;
  relatedResourcesCount: number;
  citationsCount: number;
  publisher?: string;
  pages?: number;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number; // confidence score
  citations?: string[]; // Citation reference triggers eg. "[1]", "[2]"
  sourcesUsed?: string[]; // IDs of academic resources referenced
  evidencePanel?: {
    claim: string;
    evidence: string;
    source: string;
  }[];
  followUpSuggestions?: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'paper' | 'author' | 'topic' | 'journal' | 'book';
  x: number;
  y: number;
  size: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface SearchFilters {
  resourceType: ResourceType | 'all';
  publicationYear: string; // 'all' | '3years' | '5years' | '10years'
  department: string; // 'all' | 'Computer Science' | 'Physics' | 'Humanities' | etc
  availability: 'all' | 'available' | 'borrowed';
  accessLevel: 'all' | 'Public' | 'Restricted' | 'Institutional';
}

export interface AuditLog {
  id: string;
  user: string;
  role: 'Student' | 'Faculty' | 'Librarian' | 'Admin';
  action: string;
  target: string;
  ip: string;
  timestamp: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Faculty' | 'Librarian' | 'Admin';
  institution: string;
  joined: string;
}

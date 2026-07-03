export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string;
  points: number;
  category: string;
}

export interface Exam {
  id: string;
  title: string;
  type: 'Quiz' | 'Test' | 'Exam';
  questionsCount: number;
  participantsCount: number;
  status: 'Active' | 'Completed';
  timeLimitMinutes: number;
  questions: Question[];
  enableProctoring: boolean;
  createdAt: string;
}

export type ProctoringEventType = 
  | 'tab_switch' 
  | 'focus_loss' 
  | 'face_missing' 
  | 'multiple_faces' 
  | 'voice_detected' 
  | 'suspicious_activity'
  | 'system_ok'
  | 'exam_started'
  | 'exam_submitted';

export interface ProctoringEvent {
  id: string;
  timestamp: string; // HH:MM:SS
  type: ProctoringEventType;
  message: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentName: string;
  studentId: string;
  startTime: string;
  timeLeft: number; // seconds
  status: 'InProgress' | 'Completed' | 'Flagged';
  answers: Record<string, string>;
  tabSwitches: number;
  proctoringEvents: ProctoringEvent[];
  score?: number;
  passed?: boolean;
}

// Documentation Interfaces
export interface DbColumn {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface DbTable {
  name: string;
  description: string;
  columns: DbColumn[];
}

export interface ApiRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: string;
  rateLimit: string;
  description: string;
}

export interface SecurityMitigation {
  id: string;
  feature: string;
  vulnerability: string;
  mitigation: string;
  status: 'Implemented' | 'Verifiable';
}

export interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  language: string;
  code: string;
}

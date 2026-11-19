export interface QuizOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface QuizData {
  instructionsPrompt: string;
  questions: QuizQuestion[];
}

export interface GradeResultItem {
  questionId: number;
  studentAnswer: string;
  isCorrect: boolean;
  correctOption: string;
  explanation: string;
}

export interface GradeResponse {
  score: number;
  total: number;
  summary: string;
  needsClarification: boolean;
  clarificationMessage?: string;
  results: GradeResultItem[];
}

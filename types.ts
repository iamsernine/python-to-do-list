
export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  videoUrl: string;
  custom?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type StorageType = 'json' | 'csv';

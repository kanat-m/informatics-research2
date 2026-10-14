export type Assessment = {
  id: number;
  student_name: string;
  subject: string;
  grade: number;
  assessment_type: string;
  date: string;
  class_name: string;
  teacher: string | null;
  comment: string | null;
  created_at: string;
};

export type AssessmentInput = Omit<Assessment, "id" | "created_at">;

export type User = {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
};

export type UserCreate = {
  email: string;
  password: string;
  full_name?: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};

export type FormState = { error?: string };
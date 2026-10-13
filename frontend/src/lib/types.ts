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

export type FormState = { error?: string };
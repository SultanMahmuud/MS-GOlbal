export type CurriculumStatus = "draft" | "published" | "archived";

export type CurriculumItemType =
  | "class_video"
  | "video"
  | "live_class"
  | "recorded_class"
  | "reading"
  | "note"
  | "resource"
  | "quiz"
  | "assignment"
  | "exam"
  | "homework";

export type CurriculumItem = {
  _id?: string;
  type: CurriculumItemType;
  title: string;
  description?: string;
  objective?: string;
  duration?: {
    hr?: number;
    min?: number;
    sec?: number;
  };
  teacherNote?: string;
  studentNote?: string;
  requiredMaterial?: string;
  contentUrl?: string;
  classLink?: string;
  homework?: string;
  completionRule?: "manual" | "viewed" | "quiz_passed" | "assignment_reviewed";
  lockRule?: "none" | "previous_item" | "date";
  status?: CurriculumStatus;
  order: number;
  attachments?: CurriculumAttachment[];
  video?: CurriculumVideoPayload;
  liveClass?: CurriculumLiveClassPayload;
  note?: CurriculumNotePayload;
  resource?: CurriculumResourcePayload;
  quiz?: CurriculumQuizPayload;
  assignment?: CurriculumAssignmentPayload;
  exam?: CurriculumExamPayload;
};

export type CurriculumAttachment = {
  name?: string;
  url?: string;
  key?: string;
  mimeType?: string;
  size?: number;
  provider?: string;
};

export type CurriculumVideoPayload = {
  url?: string;
  uploadUrl?: string;
  transcript?: string;
  allowDownload?: boolean;
  previewAllowed?: boolean;
};

export type CurriculumLiveClassPayload = {
  platform?: string;
  meetingUrl?: string;
  scheduledAt?: string;
  recurrence?: string;
  preparation?: string;
  recordingUrl?: string;
};

export type CurriculumNotePayload = {
  content?: string;
  pdfUrl?: string;
  allowDownload?: boolean;
};

export type CurriculumResourcePayload = {
  resourceType?: string;
  url?: string;
  instructions?: string;
  allowDownload?: boolean;
};

export type CurriculumQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "short_answer";

export type CurriculumQuizQuestion = {
  _id?: string;
  type: CurriculumQuestionType;
  question: string;
  choices: string[];
  answer?: string;
  answers?: string[];
  hint?: string;
  explanation?: string;
  mediaUrl?: string;
  mark?: number;
  order?: number;
};

export type CurriculumQuizPayload = {
  totalMark?: number;
  passMark?: number;
  timeLimitMinutes?: number;
  attemptsAllowed?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showAnswerAfterSubmit?: boolean;
  resultTone?: "friendly" | "standard";
  questions?: CurriculumQuizQuestion[];
};

export type CurriculumAssignmentPayload = {
  totalMark?: number;
  passMark?: number;
  deadline?: string;
  instructions?: string;
  rubric?: string;
  latePolicy?: string;
  allowFile?: boolean;
  allowText?: boolean;
  allowUrl?: boolean;
};

export type CurriculumExamPayload = {
  totalMark?: number;
  passMark?: number;
  timeLimitMinutes?: number;
  attemptsAllowed?: number;
  negativeMarking?: boolean;
  reviewPolicy?: "after_submit" | "after_close" | "manual";
  questions?: CurriculumQuizQuestion[];
};

export type CurriculumModule = {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  items: CurriculumItem[];
};

export type CurriculumSemester = {
  _id?: string;
  title: string;
  description?: string;
  order: number;
  modules: CurriculumModule[];
};

export type Curriculum = {
  _id?: string;
  brandKey?: string;
  title: string;
  description?: string;
  coverImage?: string;
  status: CurriculumStatus;
  version?: number;
  semesters: CurriculumSemester[];
  assignedCourseIds?: string[];
  updatedAt?: string;
};

export type CourseOption = {
  _id: string;
  title: string;
  image?: string;
  curriculumId?: string;
};

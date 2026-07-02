"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BookOpen,
  CalendarClock,
  Check,
  Copy,
  FileQuestion,
  FileText,
  FileUp,
  GraduationCap,
  ImageIcon,
  Layers3,
  LinkIcon,
  ListPlus,
  MonitorPlay,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import {
  archiveCurriculum,
  assignCurriculumToCourse,
  duplicateCurriculum,
  fetchAdminCourses,
  fetchCurriculums,
  saveCurriculum,
  uploadCurriculumFile,
  verifyAdminSession,
} from "../api";
import type {
  CourseOption,
  Curriculum,
  CurriculumAssignmentPayload,
  CurriculumExamPayload,
  CurriculumItem,
  CurriculumItemType,
  CurriculumLiveClassPayload,
  CurriculumModule,
  CurriculumNotePayload,
  CurriculumQuestionType,
  CurriculumQuizPayload,
  CurriculumQuizQuestion,
  CurriculumResourcePayload,
  CurriculumSemester,
  CurriculumStatus,
  CurriculumVideoPayload,
} from "../types";

const inputClass =
  "h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100";
const textareaClass =
  "min-h-24 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-slate-500";
const smallButtonClass =
  "inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

type Feedback = {
  type: "success" | "error" | "info";
  message: string;
};

const itemTypes: Array<{ value: CurriculumItemType; label: string; description: string }> = [
  {
    value: "class_video",
    label: "Class Video",
    description: "Recorded/video lesson, transcript, preview and resources.",
  },
  {
    value: "live_class",
    label: "Live Class",
    description: "Class link, schedule, platform and preparation note.",
  },
  {
    value: "note",
    label: "Note / Reading",
    description: "Reading content, PDF note and downloadable material.",
  },
  {
    value: "resource",
    label: "Resource",
    description: "Files, links and supporting learning material.",
  },
  {
    value: "quiz",
    label: "Quiz",
    description: "MCQ, true/false, multi-select and short answer practice.",
  },
  {
    value: "assignment",
    label: "Assignment / Homework",
    description: "Homework instructions, deadline, marks and submission rules.",
  },
  {
    value: "exam",
    label: "Exam",
    description: "Timed assessment with attempts, pass mark and review policy.",
  },
];

const legacyVideoTypes = new Set<CurriculumItemType>(["video", "recorded_class"]);

function normalizeItemType(type?: CurriculumItemType): CurriculumItemType {
  if (!type || legacyVideoTypes.has(type)) return "class_video";
  if (type === "reading" || type === "homework") return type === "reading" ? "note" : "assignment";
  return type;
}

function getTypeLabel(type?: CurriculumItemType) {
  const normalizedType = normalizeItemType(type);
  return itemTypes.find((itemType) => itemType.value === normalizedType)?.label || "Lesson";
}

function getItemIcon(type?: CurriculumItemType) {
  const normalizedType = normalizeItemType(type);
  if (normalizedType === "class_video") return <Video className="h-4 w-4" />;
  if (normalizedType === "live_class") return <CalendarClock className="h-4 w-4" />;
  if (normalizedType === "note" || normalizedType === "resource") return <FileText className="h-4 w-4" />;
  if (normalizedType === "quiz" || normalizedType === "exam") return <FileQuestion className="h-4 w-4" />;
  return <BookOpen className="h-4 w-4" />;
}

function defaultVideo(): CurriculumVideoPayload {
  return {
    url: "",
    uploadUrl: "",
    transcript: "",
    allowDownload: false,
    previewAllowed: false,
  };
}

function defaultLiveClass(): CurriculumLiveClassPayload {
  return {
    platform: "Google Meet",
    meetingUrl: "",
    scheduledAt: "",
    recurrence: "",
    preparation: "",
    recordingUrl: "",
  };
}

function defaultNote(): CurriculumNotePayload {
  return {
    content: "",
    pdfUrl: "",
    allowDownload: true,
  };
}

function defaultResource(): CurriculumResourcePayload {
  return {
    resourceType: "file",
    url: "",
    instructions: "",
    allowDownload: true,
  };
}

function defaultQuizQuestion(order = 1, type: CurriculumQuestionType = "single_choice"): CurriculumQuizQuestion {
  if (type === "true_false") {
    return {
      type,
      question: "",
      choices: ["True", "False"],
      answer: "True",
      answers: ["True"],
      hint: "",
      explanation: "",
      mediaUrl: "",
      mark: 1,
      order,
    };
  }

  return {
    type,
    question: "",
    choices: type === "short_answer" ? [] : ["Option 1", "Option 2", "Option 3", "Option 4"],
    answer: type === "short_answer" ? "" : "Option 1",
    answers: type === "multiple_choice" ? ["Option 1"] : [],
    hint: "",
    explanation: "",
    mediaUrl: "",
    mark: 1,
    order,
  };
}

function defaultQuiz(): CurriculumQuizPayload {
  return {
    totalMark: 10,
    passMark: 4,
    timeLimitMinutes: 5,
    attemptsAllowed: 2,
    shuffleQuestions: false,
    shuffleOptions: true,
    showAnswerAfterSubmit: true,
    resultTone: "friendly",
    questions: [defaultQuizQuestion(1)],
  };
}

function defaultAssignment(): CurriculumAssignmentPayload {
  return {
    totalMark: 10,
    passMark: 5,
    deadline: "",
    instructions: "",
    rubric: "",
    latePolicy: "",
    allowFile: true,
    allowText: true,
    allowUrl: true,
  };
}

function defaultExam(): CurriculumExamPayload {
  return {
    totalMark: 50,
    passMark: 20,
    timeLimitMinutes: 30,
    attemptsAllowed: 1,
    negativeMarking: false,
    reviewPolicy: "after_submit",
    questions: [defaultQuizQuestion(1)],
  };
}

function createItem(type: CurriculumItemType = "class_video", order = 1): CurriculumItem {
  const normalizedType = normalizeItemType(type);
  return hydrateItemForType({
    type: normalizedType,
    title: `${getTypeLabel(normalizedType)} ${order}`,
    description: "",
    objective: "",
    duration: { hr: 0, min: normalizedType === "exam" ? 30 : 20, sec: 0 },
    teacherNote: "",
    studentNote: "",
    requiredMaterial: "",
    contentUrl: "",
    classLink: "",
    homework: "",
    attachments: [],
    completionRule:
      normalizedType === "quiz" || normalizedType === "exam"
        ? "quiz_passed"
        : normalizedType === "assignment"
          ? "assignment_reviewed"
          : "manual",
    lockRule: "none",
    status: "draft",
    order,
  });
}

function hydrateItemForType(item: CurriculumItem): CurriculumItem {
  const type = normalizeItemType(item.type);
  const hydrated: CurriculumItem = {
    ...item,
    type,
    duration: item.duration || { hr: 0, min: 0, sec: 0 },
    attachments: item.attachments || [],
    video: item.video || defaultVideo(),
    liveClass: item.liveClass || defaultLiveClass(),
    note: item.note || defaultNote(),
    resource: item.resource || defaultResource(),
    quiz: {
      ...defaultQuiz(),
      ...(item.quiz || {}),
      questions: item.quiz?.questions?.length ? item.quiz.questions : defaultQuiz().questions,
    },
    assignment: { ...defaultAssignment(), ...(item.assignment || {}) },
    exam: {
      ...defaultExam(),
      ...(item.exam || {}),
      questions: item.exam?.questions?.length ? item.exam.questions : defaultExam().questions,
    },
  };

  if (type === "class_video") {
    hydrated.video = {
      ...defaultVideo(),
      ...hydrated.video,
      url: hydrated.video?.url || item.contentUrl || "",
      uploadUrl: hydrated.video?.uploadUrl || "",
    };
    hydrated.contentUrl = hydrated.video.url || hydrated.video.uploadUrl || item.contentUrl || "";
  }

  if (type === "live_class") {
    hydrated.liveClass = {
      ...defaultLiveClass(),
      ...hydrated.liveClass,
      meetingUrl: hydrated.liveClass?.meetingUrl || item.classLink || "",
    };
    hydrated.classLink = hydrated.liveClass.meetingUrl || item.classLink || "";
  }

  return hydrated;
}

function emptyCurriculum(): Curriculum {
  return {
    title: "New Curriculum",
    description: "",
    coverImage: "",
    status: "draft",
    semesters: [
      {
        title: "Semester 1",
        description: "",
        order: 1,
        modules: [
          {
            title: "Module 1",
            description: "",
            order: 1,
            items: [createItem("class_video", 1)],
          },
        ],
      },
    ],
  };
}

function normalizeCurriculumForSave(curriculum: Curriculum, status?: CurriculumStatus): Curriculum {
  return {
    ...curriculum,
    status: status || curriculum.status,
    title: curriculum.title?.trim() || "Untitled Curriculum",
    description: curriculum.description || "",
    coverImage: curriculum.coverImage || "",
    semesters: (curriculum.semesters || []).map((semester, semesterIndex) => ({
      ...semester,
      title: semester.title?.trim() || `Semester ${semesterIndex + 1}`,
      description: semester.description || "",
      order: semesterIndex + 1,
      modules: (semester.modules || []).map((module, moduleIndex) => ({
        ...module,
        title: module.title?.trim() || `Module ${moduleIndex + 1}`,
        description: module.description || "",
        order: moduleIndex + 1,
        items: (module.items || []).map((item, itemIndex) => {
          const hydrated = hydrateItemForType(item);
          return {
            ...hydrated,
            type: normalizeItemType(hydrated.type),
            title: hydrated.title?.trim() || `${getTypeLabel(hydrated.type)} ${itemIndex + 1}`,
            description: hydrated.description || "",
            objective: hydrated.objective || "",
            teacherNote: hydrated.teacherNote || "",
            studentNote: hydrated.studentNote || "",
            requiredMaterial: hydrated.requiredMaterial || "",
            contentUrl: hydrated.video?.url || hydrated.video?.uploadUrl || hydrated.contentUrl || "",
            classLink: hydrated.liveClass?.meetingUrl || hydrated.classLink || "",
            homework: hydrated.assignment?.instructions || hydrated.homework || "",
            attachments: hydrated.attachments || [],
            order: itemIndex + 1,
          };
        }),
      })),
    })),
  };
}

function stripNestedIdsForDraftCopy(curriculum: Curriculum): Curriculum {
  return {
    ...curriculum,
    _id: undefined,
    version: 1,
    status: "draft",
    assignedCourseIds: [],
    semesters: curriculum.semesters.map((semester) => ({
      ...semester,
      _id: undefined,
      modules: semester.modules.map((module) => ({
        ...module,
        _id: undefined,
        items: module.items.map((item) => ({
          ...item,
          _id: undefined,
          quiz: item.quiz
            ? {
                ...item.quiz,
                questions: item.quiz.questions?.map((question) => ({ ...question, _id: undefined })) || [],
              }
            : item.quiz,
          exam: item.exam
            ? {
                ...item.exam,
                questions: item.exam.questions?.map((question) => ({ ...question, _id: undefined })) || [],
              }
            : item.exam,
        })),
      })),
    })),
  };
}

const getItemCount = (curriculum: Curriculum) =>
  curriculum.semesters.reduce(
    (semesterTotal, semester) =>
      semesterTotal +
      semester.modules.reduce((moduleTotal, module) => moduleTotal + module.items.length, 0),
    0,
  );

const getStatusClass = (status: CurriculumStatus) => {
  if (status === "published") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "archived") return "border-slate-200 bg-slate-100 text-slate-500";
  return "border-amber-200 bg-amber-50 text-amber-700";
};

const isAdminSessionError = (message: string) =>
  message.toLowerCase().includes("admin session") ||
  message.toLowerCase().includes("not authorized");

const localDraftStorageKey = "qawmi:staff:curriculum-drafts:v1";

function readLocalDrafts(): Curriculum[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(localDraftStorageKey);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.map((curriculum) => normalizeCurriculumForSave(curriculum)) : [];
  } catch {
    return [];
  }
}

function writeLocalDrafts(curriculums: Curriculum[]) {
  if (typeof window === "undefined") return;

  try {
    const safeDrafts = curriculums.map((curriculum) => normalizeCurriculumForSave(curriculum));
    window.localStorage.setItem(localDraftStorageKey, JSON.stringify(safeDrafts));
  } catch {
    // Local draft backup is best-effort; server save remains the source of truth.
  }
}

function UploadField({
  label,
  url,
  accept,
  onUploaded,
}: {
  label: string;
  url?: string;
  accept?: string;
  onUploaded: (url: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const uploadedUrl = await uploadCurriculumFile(file);
      onUploaded(uploadedUrl);
      setFile(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        {url ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700">Uploaded</span> : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          type="file"
          accept={accept}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="min-w-0 flex-1 text-xs file:mr-2 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-xs font-medium text-white disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          {isUploading ? "Uploading" : "Upload"}
        </button>
      </div>
      {url ? <p className="mt-2 truncate text-[11px] text-slate-500">{url}</p> : null}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

export function CurriculumManagementPage() {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedSemesterIndex, setSelectedSemesterIndex] = useState(0);
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAuthBlocked, setIsAuthBlocked] = useState(false);

  const selectedCurriculum = curriculums[selectedIndex] || emptyCurriculum();
  const selectedSemester = selectedCurriculum.semesters[selectedSemesterIndex];
  const selectedModule = selectedSemester?.modules[selectedModuleIndex];
  const selectedItem = selectedModule?.items[selectedItemIndex];
  const selectedItemType = normalizeItemType(selectedItem?.type);

  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === selectedCourseId),
    [courses, selectedCourseId],
  );

  function persistCurriculumsLocally(nextCurriculums: Curriculum[]) {
    writeLocalDrafts(nextCurriculums);
  }

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setFeedback(null);
      try {
        await verifyAdminSession();
        if (!isMounted) return;
        setIsAuthBlocked(false);
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : "Could not load curriculum data";
        setIsAuthBlocked(isAdminSessionError(message));
        const localDrafts = readLocalDrafts();
        setCurriculums(localDrafts.length ? localDrafts : [emptyCurriculum()]);
        setCourses([]);
        setFeedback(isAdminSessionError(message) ? null : { type: "error", message });
        setIsLoading(false);
        return;
      }

      try {
        const curriculumData = await fetchCurriculums();
        if (!isMounted) return;
        const localDrafts = readLocalDrafts().filter((draft) => !draft._id);
        setCurriculums(
          curriculumData.length || localDrafts.length
            ? [...localDrafts, ...curriculumData]
            : [emptyCurriculum()],
        );
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : "Could not load curriculums";
        const localDrafts = readLocalDrafts();
        setCurriculums(localDrafts.length ? localDrafts : [emptyCurriculum()]);
        setFeedback(isAdminSessionError(message) ? null : { type: "error", message });
      }

      try {
        const courseData = await fetchAdminCourses();
        if (!isMounted) return;
        setCourses(courseData);
        setSelectedCourseId(courseData[0]?._id || "");
      } catch (error) {
        if (!isMounted) return;
        const message = error instanceof Error ? error.message : "Could not load courses";
        setFeedback((current) => current || (isAdminSessionError(message) ? null : { type: "error", message }));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCurriculum.semesters.length) {
      setSelectedSemesterIndex(0);
      setSelectedModuleIndex(0);
      setSelectedItemIndex(0);
      return;
    }

    if (selectedSemesterIndex > selectedCurriculum.semesters.length - 1) {
      setSelectedSemesterIndex(0);
      setSelectedModuleIndex(0);
      setSelectedItemIndex(0);
      return;
    }

    const modules = selectedCurriculum.semesters[selectedSemesterIndex]?.modules || [];
    if (selectedModuleIndex > Math.max(0, modules.length - 1)) {
      setSelectedModuleIndex(0);
      setSelectedItemIndex(0);
      return;
    }

    const items = modules[selectedModuleIndex]?.items || [];
    if (selectedItemIndex > Math.max(0, items.length - 1)) {
      setSelectedItemIndex(0);
    }
  }, [selectedCurriculum, selectedSemesterIndex, selectedModuleIndex, selectedItemIndex]);

  function markDirty() {
    setHasUnsavedChanges(true);
    if (feedback?.type === "success") setFeedback(null);
  }

  function updateSelectedCurriculum(updater: (curriculum: Curriculum) => Curriculum) {
    setCurriculums((current) => {
      const next = current.map((curriculum, index) => (index === selectedIndex ? updater(curriculum) : curriculum));
      persistCurriculumsLocally(next);
      return next;
    });
    markDirty();
  }

  function replaceSelectedCurriculum(curriculum: Curriculum) {
    setCurriculums((current) => {
      const next = current.map((existingCurriculum, index) => (index === selectedIndex ? curriculum : existingCurriculum));
      persistCurriculumsLocally(next);
      return next;
    });
  }

  function addCurriculum() {
    setCurriculums((current) => {
      const next = [emptyCurriculum(), ...current];
      persistCurriculumsLocally(next);
      return next;
    });
    setSelectedIndex(0);
    setSelectedSemesterIndex(0);
    setSelectedModuleIndex(0);
    setSelectedItemIndex(0);
    setHasUnsavedChanges(true);
    setFeedback({ type: "info", message: "New draft created locally. Save draft to keep it." });
  }

  function addSemester() {
    const nextIndex = selectedCurriculum.semesters.length;
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: [
        ...curriculum.semesters,
        {
          title: `Semester ${curriculum.semesters.length + 1}`,
          description: "",
          order: curriculum.semesters.length + 1,
          modules: [],
        },
      ],
    }));
    setSelectedSemesterIndex(nextIndex);
    setSelectedModuleIndex(0);
    setSelectedItemIndex(0);
  }

  function deleteSemester() {
    if (!selectedSemester) return;
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.filter((_, index) => index !== selectedSemesterIndex),
    }));
    setSelectedSemesterIndex(0);
    setSelectedModuleIndex(0);
    setSelectedItemIndex(0);
  }

  function addModule() {
    if (!selectedSemester) return;
    const nextIndex = selectedSemester.modules.length;
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.map((semester, semesterIndex) =>
        semesterIndex === selectedSemesterIndex
          ? {
              ...semester,
              modules: [
                ...semester.modules,
                {
                  title: `Module ${semester.modules.length + 1}`,
                  description: "",
                  order: semester.modules.length + 1,
                  items: [],
                },
              ],
            }
          : semester,
      ),
    }));
    setSelectedModuleIndex(nextIndex);
    setSelectedItemIndex(0);
  }

  function deleteModule() {
    if (!selectedModule) return;
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.map((semester, semesterIndex) =>
        semesterIndex === selectedSemesterIndex
          ? {
              ...semester,
              modules: semester.modules.filter((_, moduleIndex) => moduleIndex !== selectedModuleIndex),
            }
          : semester,
      ),
    }));
    setSelectedModuleIndex(0);
    setSelectedItemIndex(0);
  }

  function addItem(type: CurriculumItemType = "class_video") {
    if (!selectedModule) return;
    const nextIndex = selectedModule.items.length;
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.map((semester, semesterIndex) =>
        semesterIndex === selectedSemesterIndex
          ? {
              ...semester,
              modules: semester.modules.map((module, moduleIndex) =>
                moduleIndex === selectedModuleIndex
                  ? {
                      ...module,
                      items: [...module.items, createItem(type, module.items.length + 1)],
                    }
                  : module,
              ),
            }
          : semester,
      ),
    }));
    setSelectedItemIndex(nextIndex);
  }

  function deleteItem() {
    if (!selectedItem) return;
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.map((semester, semesterIndex) =>
        semesterIndex === selectedSemesterIndex
          ? {
              ...semester,
              modules: semester.modules.map((module, moduleIndex) =>
                moduleIndex === selectedModuleIndex
                  ? {
                      ...module,
                      items: module.items.filter((_, itemIndex) => itemIndex !== selectedItemIndex),
                    }
                  : module,
              ),
            }
          : semester,
      ),
    }));
    setSelectedItemIndex(0);
  }

  function updateSemester(value: Partial<CurriculumSemester>) {
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.map((semester, index) =>
        index === selectedSemesterIndex ? { ...semester, ...value } : semester,
      ),
    }));
  }

  function updateModule(value: Partial<CurriculumModule>) {
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.map((semester, semesterIndex) =>
        semesterIndex === selectedSemesterIndex
          ? {
              ...semester,
              modules: semester.modules.map((module, moduleIndex) =>
                moduleIndex === selectedModuleIndex ? { ...module, ...value } : module,
              ),
            }
          : semester,
      ),
    }));
  }

  function updateItem(value: Partial<CurriculumItem>) {
    updateSelectedCurriculum((curriculum) => ({
      ...curriculum,
      semesters: curriculum.semesters.map((semester, semesterIndex) =>
        semesterIndex === selectedSemesterIndex
          ? {
              ...semester,
              modules: semester.modules.map((module, moduleIndex) =>
                moduleIndex === selectedModuleIndex
                  ? {
                      ...module,
                      items: module.items.map((item, itemIndex) =>
                        itemIndex === selectedItemIndex ? hydrateItemForType({ ...item, ...value }) : item,
                      ),
                    }
                  : module,
              ),
            }
          : semester,
      ),
    }));
  }

  function updateVideo(value: Partial<CurriculumVideoPayload>) {
    if (!selectedItem) return;
    const nextVideo = { ...defaultVideo(), ...(selectedItem.video || {}), ...value };
    updateItem({
      video: nextVideo,
      contentUrl: nextVideo.url || nextVideo.uploadUrl || selectedItem.contentUrl || "",
    });
  }

  function updateLiveClass(value: Partial<CurriculumLiveClassPayload>) {
    if (!selectedItem) return;
    const nextLiveClass = { ...defaultLiveClass(), ...(selectedItem.liveClass || {}), ...value };
    updateItem({
      liveClass: nextLiveClass,
      classLink: nextLiveClass.meetingUrl || selectedItem.classLink || "",
    });
  }

  function updateNote(value: Partial<CurriculumNotePayload>) {
    updateItem({ note: { ...defaultNote(), ...(selectedItem?.note || {}), ...value } });
  }

  function updateResource(value: Partial<CurriculumResourcePayload>) {
    updateItem({ resource: { ...defaultResource(), ...(selectedItem?.resource || {}), ...value } });
  }

  function updateAssignment(value: Partial<CurriculumAssignmentPayload>) {
    const nextAssignment = { ...defaultAssignment(), ...(selectedItem?.assignment || {}), ...value };
    updateItem({ assignment: nextAssignment, homework: nextAssignment.instructions || "" });
  }

  function updateQuiz(value: Partial<CurriculumQuizPayload>) {
    updateItem({ quiz: { ...defaultQuiz(), ...(selectedItem?.quiz || {}), ...value } });
  }

  function updateExam(value: Partial<CurriculumExamPayload>) {
    updateItem({ exam: { ...defaultExam(), ...(selectedItem?.exam || {}), ...value } });
  }

  function changeItemType(type: CurriculumItemType) {
    if (!selectedItem) return;
    const previousType = normalizeItemType(selectedItem.type);
    const nextType = normalizeItemType(type);
    const previousLabel = getTypeLabel(previousType);
    const nextLabel = getTypeLabel(nextType);
    const shouldRename =
      !selectedItem.title ||
      selectedItem.title === previousLabel ||
      selectedItem.title.startsWith(`${previousLabel} `);

    const nextItem = hydrateItemForType({
      ...selectedItem,
      type: nextType,
      title: shouldRename ? `${nextLabel} ${selectedItem.order || selectedItemIndex + 1}` : selectedItem.title,
      contentUrl: "",
      classLink: "",
      homework: "",
      video: nextType === "class_video" ? selectedItem.video || defaultVideo() : defaultVideo(),
      liveClass: nextType === "live_class" ? selectedItem.liveClass || defaultLiveClass() : defaultLiveClass(),
      note: nextType === "note" ? selectedItem.note || defaultNote() : defaultNote(),
      resource: nextType === "resource" ? selectedItem.resource || defaultResource() : defaultResource(),
      quiz: nextType === "quiz" ? selectedItem.quiz || defaultQuiz() : defaultQuiz(),
      assignment: nextType === "assignment" ? selectedItem.assignment || defaultAssignment() : defaultAssignment(),
      exam: nextType === "exam" ? selectedItem.exam || defaultExam() : defaultExam(),
      completionRule:
        nextType === "quiz" || nextType === "exam"
          ? "quiz_passed"
          : nextType === "assignment"
            ? "assignment_reviewed"
            : nextType === "class_video"
              ? "viewed"
              : "manual",
    });

    updateItem(nextItem);
  }

  async function handleSave(status?: CurriculumStatus) {
    setIsSaving(true);
    setFeedback(null);
    const normalized = normalizeCurriculumForSave(selectedCurriculum, status);

    try {
      const saved = await saveCurriculum(normalized);
      replaceSelectedCurriculum(saved);
      setHasUnsavedChanges(false);
      setFeedback({
        type: "success",
        message:
          status === "published"
            ? "Curriculum published successfully."
            : selectedCurriculum._id
              ? "Curriculum changes saved successfully."
              : "Draft curriculum saved successfully.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not save curriculum";
      setCurriculums((current) => {
        const next = current.map((curriculum, index) =>
          index === selectedIndex ? normalized : curriculum,
        );
        persistCurriculumsLocally(next);
        return next;
      });
      setHasUnsavedChanges(false);
      setFeedback(
        isAdminSessionError(message)
          ? {
              type: "info",
              message:
                "Draft saved locally on this browser. Server save needs a valid admin session.",
            }
          : {
              type: "error",
              message,
            },
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDuplicate() {
    setFeedback(null);
    try {
      await verifyAdminSession();
      setIsAuthBlocked(false);
      if (!selectedCurriculum._id) {
        const copy = stripNestedIdsForDraftCopy({
          ...normalizeCurriculumForSave(selectedCurriculum),
          title: `${selectedCurriculum.title} Copy`,
        });
        setCurriculums((current) => [copy, ...current]);
        setSelectedIndex(0);
        setSelectedSemesterIndex(0);
        setSelectedModuleIndex(0);
        setSelectedItemIndex(0);
        setHasUnsavedChanges(true);
        setFeedback({ type: "info", message: "Local copy created. Save draft to keep it." });
        return;
      }

      const copy = await duplicateCurriculum(selectedCurriculum._id);
      setCurriculums((current) => [copy, ...current]);
      setSelectedIndex(0);
      setSelectedSemesterIndex(0);
      setSelectedModuleIndex(0);
      setSelectedItemIndex(0);
      setHasUnsavedChanges(false);
      setFeedback({ type: "success", message: "Curriculum duplicated successfully." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not duplicate curriculum";
      setIsAuthBlocked(isAdminSessionError(message));
      setFeedback({
        type: "error",
        message,
      });
    }
  }

  async function handleArchive() {
    setFeedback(null);
    try {
      await verifyAdminSession();
      setIsAuthBlocked(false);
      if (!selectedCurriculum._id) {
        updateSelectedCurriculum((curriculum) => ({ ...curriculum, status: "archived" }));
        setFeedback({ type: "info", message: "Local draft archived. Save it if you want to keep this state." });
        return;
      }

      const archived = await archiveCurriculum(selectedCurriculum._id);
      replaceSelectedCurriculum(archived);
      setHasUnsavedChanges(false);
      setFeedback({ type: "success", message: "Curriculum archived successfully." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not archive curriculum";
      setIsAuthBlocked(isAdminSessionError(message));
      setFeedback({
        type: "error",
        message,
      });
    }
  }

  async function handleAssignCourse() {
    if (!selectedCurriculum._id) {
      setFeedback({ type: "error", message: "Please save the curriculum before assigning it to a course." });
      return;
    }
    if (!selectedCourseId) {
      setFeedback({ type: "error", message: "Please choose a course first." });
      return;
    }

    setFeedback(null);
    try {
      await verifyAdminSession();
      setIsAuthBlocked(false);
      await assignCurriculumToCourse(selectedCourseId, selectedCurriculum._id);
      const nextAssignedCourseIds = Array.from(
        new Set([...(selectedCurriculum.assignedCourseIds || []), selectedCourseId]),
      );
      replaceSelectedCurriculum({
        ...selectedCurriculum,
        assignedCourseIds: nextAssignedCourseIds,
      });
      setCourses((current) =>
        current.map((course) =>
          course._id === selectedCourseId ? { ...course, curriculumId: selectedCurriculum._id } : course,
        ),
      );
      setFeedback({ type: "success", message: `Assigned to ${selectedCourse?.title || "selected course"}.` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not assign curriculum";
      setIsAuthBlocked(isAdminSessionError(message));
      setFeedback({
        type: "error",
        message,
      });
    }
  }

  return (
    <main className="min-h-[calc(100vh-2.5rem)] bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-none space-y-6">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">Admin only</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Curriculum</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Build reusable paid learning structures with semesters, modules, class videos, live classes,
              quizzes, assignments, notes, and teacher instructions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addCurriculum} className={smallButtonClass}>
              <Plus className="h-4 w-4" /> New
            </button>
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-200 bg-white px-4 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              <Check className="h-4 w-4" /> Publish
            </button>
          </div>
        </header>

        {feedback ? (
          <div
            className={`flex flex-col gap-3 rounded-md border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${
              feedback.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-sky-200 bg-sky-50 text-sky-800"
            }`}
          >
            <span>{feedback.message}</span>
            {feedback.type === "error" && isAdminSessionError(feedback.message) ? (
              <a
                href="/admin-login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-3 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Login again
              </a>
            ) : null}
          </div>
        ) : null}

        {hasUnsavedChanges ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Unsaved changes are only local until you save draft or save changes.
          </div>
        ) : null}

        <section className="grid items-start gap-5 xl:grid-cols-[300px_minmax(620px,1fr)_430px] 2xl:grid-cols-[320px_minmax(720px,1fr)_460px]">
          <aside className="max-h-[calc(100vh-9rem)] self-start overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Curriculums</h2>
              {isLoading ? <span className="text-xs text-slate-500">Loading...</span> : null}
            </div>
            <div className="space-y-2">
              {curriculums.map((curriculum, index) => (
                <button
                  type="button"
                  key={curriculum._id || `${curriculum.title}-${index}`}
                  onClick={() => {
                    setSelectedIndex(index);
                    setSelectedSemesterIndex(0);
                    setSelectedModuleIndex(0);
                    setSelectedItemIndex(0);
                    setHasUnsavedChanges(false);
                    setFeedback(null);
                  }}
                  className={`w-full rounded-md border p-3 text-left transition ${
                    index === selectedIndex
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{curriculum.title}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getStatusClass(curriculum.status)}`}>
                      {curriculum.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {curriculum.semesters.length} semester, {getItemCount(curriculum)} items
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Assigned courses: {curriculum.assignedCourseIds?.length || 0}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
                <div className="space-y-3">
                  <label className={labelClass}>Curriculum title</label>
                  <input
                    value={selectedCurriculum.title}
                    onChange={(event) =>
                      updateSelectedCurriculum((curriculum) => ({
                        ...curriculum,
                        title: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={selectedCurriculum.description || ""}
                    onChange={(event) =>
                      updateSelectedCurriculum((curriculum) => ({
                        ...curriculum,
                        description: event.target.value,
                      }))
                    }
                    className={textareaClass}
                  />
                </div>
                <div className="space-y-3">
                  <label className={labelClass}>Cover image</label>
                  <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                    {selectedCurriculum.coverImage ? (
                      <img
                        src={selectedCurriculum.coverImage}
                        alt={selectedCurriculum.title}
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center text-slate-400">
                        <ImageIcon className="h-7 w-7" />
                      </div>
                    )}
                  </div>
                  <UploadField
                    label="Upload cover image"
                    url={selectedCurriculum.coverImage}
                    accept="image/*"
                    onUploaded={(url) =>
                      updateSelectedCurriculum((curriculum) => ({
                        ...curriculum,
                        coverImage: url,
                      }))
                    }
                  />
                  <label className={labelClass}>Status</label>
                  <select
                    value={selectedCurriculum.status}
                    onChange={(event) =>
                      updateSelectedCurriculum((curriculum) => ({
                        ...curriculum,
                        status: event.target.value as CurriculumStatus,
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={handleDuplicate} className={smallButtonClass}>
                      <Copy className="h-4 w-4" /> Duplicate
                    </button>
                    <button
                      type="button"
                      onClick={handleArchive}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-rose-200 text-xs font-medium text-rose-700 hover:bg-rose-50"
                    >
                      <Archive className="h-4 w-4" /> Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Structure</h3>
                  <button
                    type="button"
                    onClick={addSemester}
                    className="inline-flex h-8 items-center gap-1 rounded-md bg-slate-950 px-3 text-xs font-medium text-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> Semester
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedCurriculum.semesters.length ? (
                    selectedCurriculum.semesters.map((semester, semesterIndex) => (
                      <div key={semester._id || semesterIndex}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSemesterIndex(semesterIndex);
                            setSelectedModuleIndex(0);
                            setSelectedItemIndex(0);
                          }}
                          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm ${
                            semesterIndex === selectedSemesterIndex
                              ? "bg-emerald-50 text-emerald-800"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <GraduationCap className="h-4 w-4" />
                          <span className="truncate">{semester.title}</span>
                        </button>
                        <div className="ml-5 mt-1 space-y-1 border-l border-slate-200 pl-2">
                          {semester.modules.length ? (
                            semester.modules.map((module, moduleIndex) => (
                              <button
                                type="button"
                                key={module._id || moduleIndex}
                                onClick={() => {
                                  setSelectedSemesterIndex(semesterIndex);
                                  setSelectedModuleIndex(moduleIndex);
                                  setSelectedItemIndex(0);
                                }}
                                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs ${
                                  semesterIndex === selectedSemesterIndex && moduleIndex === selectedModuleIndex
                                    ? "bg-slate-950 text-white"
                                    : "text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                <Layers3 className="h-3.5 w-3.5" />
                                <span className="truncate">{module.title}</span>
                              </button>
                            ))
                          ) : (
                            <p className="px-2 py-1 text-xs text-slate-400">No module yet</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">
                      No semester yet. Add a semester to start.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Selected semester/module</p>
                    <h3 className="text-base font-semibold">
                      {selectedSemester?.title || "No semester"} / {selectedModule?.title || "No module"}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={deleteSemester} disabled={!selectedSemester} className={smallButtonClass}>
                      <Trash2 className="h-4 w-4" /> Semester
                    </button>
                    <button type="button" onClick={addModule} disabled={!selectedSemester} className={smallButtonClass}>
                      <Plus className="h-4 w-4" /> Module
                    </button>
                    <button type="button" onClick={deleteModule} disabled={!selectedModule} className={smallButtonClass}>
                      <Trash2 className="h-4 w-4" /> Module
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 p-4">
                  <div className="space-y-3">
                    <label className={labelClass}>Semester title</label>
                    <input
                      value={selectedSemester?.title || ""}
                      disabled={!selectedSemester}
                      onChange={(event) => updateSemester({ title: event.target.value })}
                      className={inputClass}
                    />
                    <label className={labelClass}>Semester description</label>
                    <textarea
                      value={selectedSemester?.description || ""}
                      disabled={!selectedSemester}
                      onChange={(event) => updateSemester({ description: event.target.value })}
                      className={textareaClass}
                    />
                    <label className={labelClass}>Module title</label>
                    <input
                      value={selectedModule?.title || ""}
                      disabled={!selectedModule}
                      onChange={(event) => updateModule({ title: event.target.value })}
                      className={inputClass}
                    />
                    <label className={labelClass}>Module description</label>
                    <textarea
                      value={selectedModule?.description || ""}
                      disabled={!selectedModule}
                      onChange={(event) => updateModule({ description: event.target.value })}
                      className={textareaClass}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className={labelClass}>Lesson items</p>
                      <button
                        type="button"
                        onClick={() => addItem("class_video")}
                        disabled={!selectedModule}
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-emerald-600 px-3 text-xs font-medium text-white disabled:opacity-50"
                      >
                        <ListPlus className="h-3.5 w-3.5" /> Add Item
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {itemTypes.map((type) => (
                        <button
                          type="button"
                          key={type.value}
                          onClick={() => addItem(type.value)}
                          disabled={!selectedModule}
                          className="min-h-9 rounded-md border border-slate-200 px-3 py-2 text-left text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                          + {type.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {selectedModule?.items.length ? (
                        selectedModule.items.map((item, itemIndex) => (
                          <button
                            type="button"
                            key={item._id || itemIndex}
                            onClick={() => setSelectedItemIndex(itemIndex)}
                            className={`flex w-full items-center gap-3 rounded-md border p-3 text-left ${
                              itemIndex === selectedItemIndex
                                ? "border-emerald-400 bg-emerald-50"
                                : "border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                              {getItemIcon(item.type)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{item.title}</span>
                              <span className="block text-xs text-slate-500">{getTypeLabel(item.type)}</span>
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-500">
                          No lesson item yet. Add Class Video, Quiz, Assignment or another type.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="max-h-[calc(100vh-8rem)] self-start space-y-4 overflow-y-auto xl:sticky xl:top-5">
            <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold">Lesson item editor</h2>
                <button type="button" onClick={deleteItem} disabled={!selectedItem} className={smallButtonClass}>
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
              {selectedItem ? (
                <div className="mt-4 space-y-4">
                  <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <label className={labelClass}>Type</label>
                    <select
                      value={selectedItemType}
                      onChange={(event) => changeItemType(event.target.value as CurriculumItemType)}
                      className={inputClass}
                    >
                      {itemTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs leading-5 text-slate-500">
                      {itemTypes.find((type) => type.value === selectedItemType)?.description}
                    </p>
                  </div>

                  <div key={`${selectedItem._id || selectedItemIndex}-${selectedItemType}`}>
                    {selectedItemType === "class_video" ? (
                      <ClassVideoFields item={selectedItem} onUpdate={updateVideo} />
                    ) : null}

                    {selectedItemType === "live_class" ? (
                      <LiveClassFields item={selectedItem} onUpdate={updateLiveClass} />
                    ) : null}

                    {selectedItemType === "note" ? (
                      <NoteFields item={selectedItem} onUpdate={updateNote} />
                    ) : null}

                    {selectedItemType === "resource" ? (
                      <ResourceFields item={selectedItem} onUpdate={updateResource} />
                    ) : null}

                    {selectedItemType === "assignment" ? (
                      <AssignmentFields item={selectedItem} onUpdate={updateAssignment} />
                    ) : null}

                    {selectedItemType === "quiz" ? (
                      <QuizBuilder
                        payload={{ ...defaultQuiz(), ...(selectedItem.quiz || {}) }}
                        onUpdate={updateQuiz}
                        title="Quiz builder"
                      />
                    ) : null}

                    {selectedItemType === "exam" ? (
                      <ExamFields item={selectedItem} onUpdate={updateExam} />
                    ) : null}
                  </div>

                  <CommonItemFields
                    item={selectedItem}
                    onUpdate={updateItem}
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Add a lesson item to edit details.</p>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold">Assign to course</h2>
              <p className="mt-1 text-xs text-slate-500">
                Course public page stays separate; this curriculum is the paid learning path after purchase.
              </p>
              {courses.length ? (
                <select
                  value={selectedCourseId}
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                  className={`${inputClass} mt-3`}
                >
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} {course.curriculumId === selectedCurriculum._id ? "(assigned)" : ""}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-3 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                  No courses loaded. Check the admin session and try again.
                </p>
              )}
              <button
                type="button"
                onClick={handleAssignCourse}
                disabled={!selectedCurriculum._id || !selectedCourseId}
                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <BookOpen className="h-4 w-4" /> Assign Curriculum
              </button>
              {!selectedCurriculum._id ? (
                <p className="mt-2 text-xs text-slate-500">Save this curriculum before assigning it to a course.</p>
              ) : null}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function CommonItemFields({
  item,
  onUpdate,
}: {
  item: CurriculumItem;
  onUpdate: (value: Partial<CurriculumItem>) => void;
}) {
  return (
    <div className="space-y-3 rounded-md border border-slate-200 bg-white p-3">
      <h3 className="text-sm font-semibold">Basic lesson information</h3>
      <label className={labelClass}>Title</label>
      <input value={item.title} onChange={(event) => onUpdate({ title: event.target.value })} className={inputClass} />
      <label className={labelClass}>Description</label>
      <textarea
        value={item.description || ""}
        onChange={(event) => onUpdate({ description: event.target.value })}
        className={textareaClass}
      />
      <label className={labelClass}>Learning objective</label>
      <textarea
        value={item.objective || ""}
        onChange={(event) => onUpdate({ objective: event.target.value })}
        className={textareaClass}
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelClass}>Hour</label>
          <input
            type="number"
            min={0}
            value={item.duration?.hr || 0}
            onChange={(event) => onUpdate({ duration: { ...item.duration, hr: Number(event.target.value) } })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Min</label>
          <input
            type="number"
            min={0}
            value={item.duration?.min || 0}
            onChange={(event) => onUpdate({ duration: { ...item.duration, min: Number(event.target.value) } })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Sec</label>
          <input
            type="number"
            min={0}
            value={item.duration?.sec || 0}
            onChange={(event) => onUpdate({ duration: { ...item.duration, sec: Number(event.target.value) } })}
            className={inputClass}
          />
        </div>
      </div>
      <label className={labelClass}>Teacher note</label>
      <textarea
        value={item.teacherNote || ""}
        onChange={(event) => onUpdate({ teacherNote: event.target.value })}
        className={textareaClass}
      />
      <label className={labelClass}>Student note</label>
      <textarea
        value={item.studentNote || ""}
        onChange={(event) => onUpdate({ studentNote: event.target.value })}
        className={textareaClass}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Completion</label>
          <select
            value={item.completionRule || "manual"}
            onChange={(event) => onUpdate({ completionRule: event.target.value as CurriculumItem["completionRule"] })}
            className={inputClass}
          >
            <option value="manual">Manual</option>
            <option value="viewed">Viewed</option>
            <option value="quiz_passed">Quiz passed</option>
            <option value="assignment_reviewed">Assignment reviewed</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={item.status || "draft"}
            onChange={(event) => onUpdate({ status: event.target.value as CurriculumStatus })}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ClassVideoFields({
  item,
  onUpdate,
}: {
  item: CurriculumItem;
  onUpdate: (value: Partial<CurriculumVideoPayload>) => void;
}) {
  const video = { ...defaultVideo(), ...(item.video || {}) };
  return (
    <div className="space-y-3 rounded-md border border-slate-200 p-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <MonitorPlay className="h-4 w-4" /> Class Video
      </h3>
      <label className={labelClass}>Class video URL</label>
      <div className="flex gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <LinkIcon className="h-4 w-4" />
        </span>
        <input
          value={video.url || ""}
          onChange={(event) => onUpdate({ url: event.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
      </div>
      <UploadField
        label="Upload video file"
        url={video.uploadUrl}
        accept="video/*"
        onUploaded={(url) => onUpdate({ uploadUrl: url })}
      />
      <label className={labelClass}>Transcript / video note</label>
      <textarea
        value={video.transcript || ""}
        onChange={(event) => onUpdate({ transcript: event.target.value })}
        className={textareaClass}
      />
      <ToggleRow
        label="Allow download"
        checked={!!video.allowDownload}
        onChange={(checked) => onUpdate({ allowDownload: checked })}
      />
      <ToggleRow
        label="Can be previewed before purchase"
        checked={!!video.previewAllowed}
        onChange={(checked) => onUpdate({ previewAllowed: checked })}
      />
    </div>
  );
}

function LiveClassFields({
  item,
  onUpdate,
}: {
  item: CurriculumItem;
  onUpdate: (value: Partial<CurriculumLiveClassPayload>) => void;
}) {
  const liveClass = { ...defaultLiveClass(), ...(item.liveClass || {}) };
  return (
    <div className="space-y-3 rounded-md border border-slate-200 p-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <CalendarClock className="h-4 w-4" /> Live Class
      </h3>
      <label className={labelClass}>Platform</label>
      <select
        value={liveClass.platform || "Google Meet"}
        onChange={(event) => onUpdate({ platform: event.target.value })}
        className={inputClass}
      >
        <option value="Google Meet">Google Meet</option>
        <option value="Zoom">Zoom</option>
        <option value="YouTube Live">YouTube Live</option>
        <option value="Other">Other</option>
      </select>
      <label className={labelClass}>Meeting link</label>
      <input
        value={liveClass.meetingUrl || ""}
        onChange={(event) => onUpdate({ meetingUrl: event.target.value })}
        className={inputClass}
        placeholder="https://meet.google.com/..."
      />
      <label className={labelClass}>Class date/time</label>
      <input
        type="datetime-local"
        value={liveClass.scheduledAt || ""}
        onChange={(event) => onUpdate({ scheduledAt: event.target.value })}
        className={inputClass}
      />
      <label className={labelClass}>Recurrence / schedule note</label>
      <input
        value={liveClass.recurrence || ""}
        onChange={(event) => onUpdate({ recurrence: event.target.value })}
        className={inputClass}
        placeholder="Every Sunday, 8:00 PM"
      />
      <label className={labelClass}>Student preparation</label>
      <textarea
        value={liveClass.preparation || ""}
        onChange={(event) => onUpdate({ preparation: event.target.value })}
        className={textareaClass}
      />
      <label className={labelClass}>Recording link after class</label>
      <input
        value={liveClass.recordingUrl || ""}
        onChange={(event) => onUpdate({ recordingUrl: event.target.value })}
        className={inputClass}
      />
    </div>
  );
}

function NoteFields({
  item,
  onUpdate,
}: {
  item: CurriculumItem;
  onUpdate: (value: Partial<CurriculumNotePayload>) => void;
}) {
  const note = { ...defaultNote(), ...(item.note || {}) };
  return (
    <div className="space-y-3 rounded-md border border-slate-200 p-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <FileText className="h-4 w-4" /> Note / Reading
      </h3>
      <label className={labelClass}>Reading content</label>
      <textarea
        value={note.content || ""}
        onChange={(event) => onUpdate({ content: event.target.value })}
        className="min-h-40 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <UploadField
        label="Upload PDF note"
        url={note.pdfUrl}
        accept=".pdf,.doc,.docx,image/*"
        onUploaded={(url) => onUpdate({ pdfUrl: url })}
      />
      <ToggleRow
        label="Allow student download"
        checked={note.allowDownload !== false}
        onChange={(checked) => onUpdate({ allowDownload: checked })}
      />
    </div>
  );
}

function ResourceFields({
  item,
  onUpdate,
}: {
  item: CurriculumItem;
  onUpdate: (value: Partial<CurriculumResourcePayload>) => void;
}) {
  const resource = { ...defaultResource(), ...(item.resource || {}) };
  return (
    <div className="space-y-3 rounded-md border border-slate-200 p-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <FileUp className="h-4 w-4" /> Resource
      </h3>
      <label className={labelClass}>Resource type</label>
      <select
        value={resource.resourceType || "file"}
        onChange={(event) => onUpdate({ resourceType: event.target.value })}
        className={inputClass}
      >
        <option value="file">File</option>
        <option value="link">External link</option>
        <option value="worksheet">Worksheet</option>
        <option value="slides">Slides</option>
      </select>
      <label className={labelClass}>Resource URL</label>
      <input
        value={resource.url || ""}
        onChange={(event) => onUpdate({ url: event.target.value })}
        className={inputClass}
      />
      <UploadField label="Upload resource" url={resource.url} onUploaded={(url) => onUpdate({ url })} />
      <label className={labelClass}>Instructions</label>
      <textarea
        value={resource.instructions || ""}
        onChange={(event) => onUpdate({ instructions: event.target.value })}
        className={textareaClass}
      />
      <ToggleRow
        label="Allow download"
        checked={resource.allowDownload !== false}
        onChange={(checked) => onUpdate({ allowDownload: checked })}
      />
    </div>
  );
}

function AssignmentFields({
  item,
  onUpdate,
}: {
  item: CurriculumItem;
  onUpdate: (value: Partial<CurriculumAssignmentPayload>) => void;
}) {
  const assignment = { ...defaultAssignment(), ...(item.assignment || {}) };
  return (
    <div className="space-y-3 rounded-md border border-slate-200 p-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <BookOpen className="h-4 w-4" /> Assignment / Homework
      </h3>
      <label className={labelClass}>Instructions</label>
      <textarea
        value={assignment.instructions || ""}
        onChange={(event) => onUpdate({ instructions: event.target.value })}
        className={textareaClass}
      />
      <label className={labelClass}>Deadline</label>
      <input
        type="datetime-local"
        value={assignment.deadline || ""}
        onChange={(event) => onUpdate({ deadline: event.target.value })}
        className={inputClass}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Total mark</label>
          <input
            type="number"
            min={0}
            value={assignment.totalMark || 0}
            onChange={(event) => onUpdate({ totalMark: Number(event.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Pass mark</label>
          <input
            type="number"
            min={0}
            value={assignment.passMark || 0}
            onChange={(event) => onUpdate({ passMark: Number(event.target.value) })}
            className={inputClass}
          />
        </div>
      </div>
      <label className={labelClass}>Rubric</label>
      <textarea
        value={assignment.rubric || ""}
        onChange={(event) => onUpdate({ rubric: event.target.value })}
        className={textareaClass}
      />
      <label className={labelClass}>Late policy</label>
      <textarea
        value={assignment.latePolicy || ""}
        onChange={(event) => onUpdate({ latePolicy: event.target.value })}
        className={textareaClass}
      />
      <div className="grid gap-2 sm:grid-cols-3">
        <ToggleRow label="Text" checked={assignment.allowText !== false} onChange={(checked) => onUpdate({ allowText: checked })} />
        <ToggleRow label="URL" checked={assignment.allowUrl !== false} onChange={(checked) => onUpdate({ allowUrl: checked })} />
        <ToggleRow label="File" checked={assignment.allowFile !== false} onChange={(checked) => onUpdate({ allowFile: checked })} />
      </div>
    </div>
  );
}

function ExamFields({
  item,
  onUpdate,
}: {
  item: CurriculumItem;
  onUpdate: (value: Partial<CurriculumExamPayload>) => void;
}) {
  const exam = { ...defaultExam(), ...(item.exam || {}) };
  return (
    <div className="space-y-4 rounded-md border border-slate-200 p-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <FileQuestion className="h-4 w-4" /> Exam
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={labelClass}>Total mark</label>
          <input
            type="number"
            min={0}
            value={exam.totalMark || 0}
            onChange={(event) => onUpdate({ totalMark: Number(event.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Pass mark</label>
          <input
            type="number"
            min={0}
            value={exam.passMark || 0}
            onChange={(event) => onUpdate({ passMark: Number(event.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Time limit</label>
          <input
            type="number"
            min={0}
            value={exam.timeLimitMinutes || 0}
            onChange={(event) => onUpdate({ timeLimitMinutes: Number(event.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Attempts</label>
          <input
            type="number"
            min={1}
            value={exam.attemptsAllowed || 1}
            onChange={(event) => onUpdate({ attemptsAllowed: Number(event.target.value) })}
            className={inputClass}
          />
        </div>
      </div>
      <label className={labelClass}>Review policy</label>
      <select
        value={exam.reviewPolicy || "after_submit"}
        onChange={(event) => onUpdate({ reviewPolicy: event.target.value as CurriculumExamPayload["reviewPolicy"] })}
        className={inputClass}
      >
        <option value="after_submit">After submit</option>
        <option value="after_close">After exam closes</option>
        <option value="manual">Manual</option>
      </select>
      <ToggleRow
        label="Negative marking"
        checked={!!exam.negativeMarking}
        onChange={(checked) => onUpdate({ negativeMarking: checked })}
      />
      <QuizBuilder
        title="Exam questions"
        payload={{
          totalMark: exam.totalMark,
          passMark: exam.passMark,
          timeLimitMinutes: exam.timeLimitMinutes,
          attemptsAllowed: exam.attemptsAllowed,
          questions: exam.questions || [],
        }}
        onUpdate={(value) => onUpdate(value as Partial<CurriculumExamPayload>)}
        compactSettings
      />
    </div>
  );
}

function QuizBuilder({
  payload,
  onUpdate,
  title,
  compactSettings = false,
}: {
  payload: CurriculumQuizPayload;
  onUpdate: (value: Partial<CurriculumQuizPayload>) => void;
  title: string;
  compactSettings?: boolean;
}) {
  const quiz = { ...defaultQuiz(), ...payload, questions: payload.questions?.length ? payload.questions : [] };
  const questions = quiz.questions || [];

  function updateQuestion(questionIndex: number, value: Partial<CurriculumQuizQuestion>) {
    onUpdate({
      questions: questions.map((question, index) =>
        index === questionIndex ? normalizeQuestion({ ...question, ...value }) : question,
      ),
    });
  }

  function addQuestion(type: CurriculumQuestionType = "single_choice") {
    onUpdate({ questions: [...questions, defaultQuizQuestion(questions.length + 1, type)] });
  }

  function deleteQuestion(questionIndex: number) {
    onUpdate({ questions: questions.filter((_, index) => index !== questionIndex) });
  }

  return (
    <div className="space-y-4 rounded-md border border-emerald-100 bg-emerald-50/40 p-3">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <FileQuestion className="h-4 w-4" /> {title}
        </h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Questions save in a structured format for large answer buttons, progress, retry, and clean review feedback.
        </p>
      </div>

      {!compactSettings ? (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Total mark</label>
            <input
              type="number"
              min={0}
              value={quiz.totalMark || 0}
              onChange={(event) => onUpdate({ totalMark: Number(event.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Pass mark</label>
            <input
              type="number"
              min={0}
              value={quiz.passMark || 0}
              onChange={(event) => onUpdate({ passMark: Number(event.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Time limit</label>
            <input
              type="number"
              min={0}
              value={quiz.timeLimitMinutes || 0}
              onChange={(event) => onUpdate({ timeLimitMinutes: Number(event.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Attempts</label>
            <input
              type="number"
              min={1}
              value={quiz.attemptsAllowed || 1}
              onChange={(event) => onUpdate({ attemptsAllowed: Number(event.target.value) })}
              className={inputClass}
            />
          </div>
        </div>
      ) : null}

      {!compactSettings ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <ToggleRow
            label="Shuffle questions"
            checked={!!quiz.shuffleQuestions}
            onChange={(checked) => onUpdate({ shuffleQuestions: checked })}
          />
          <ToggleRow
            label="Shuffle options"
            checked={!!quiz.shuffleOptions}
            onChange={(checked) => onUpdate({ shuffleOptions: checked })}
          />
          <ToggleRow
            label="Show answer after submit"
            checked={quiz.showAnswerAfterSubmit !== false}
            onChange={(checked) => onUpdate({ showAnswerAfterSubmit: checked })}
          />
          <div>
            <label className={labelClass}>Result tone</label>
            <select
              value={quiz.resultTone || "friendly"}
              onChange={(event) => onUpdate({ resultTone: event.target.value as CurriculumQuizPayload["resultTone"] })}
              className={inputClass}
            >
              <option value="friendly">Friendly</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => addQuestion("single_choice")} className={smallButtonClass}>
          + MCQ
        </button>
        <button type="button" onClick={() => addQuestion("multiple_choice")} className={smallButtonClass}>
          + Multi-select
        </button>
        <button type="button" onClick={() => addQuestion("true_false")} className={smallButtonClass}>
          + True/False
        </button>
        <button type="button" onClick={() => addQuestion("short_answer")} className={smallButtonClass}>
          + Short Answer
        </button>
      </div>

      <div className="space-y-3">
        {questions.length ? (
          questions.map((question, questionIndex) => (
            <QuestionEditor
              key={question._id || questionIndex}
              question={normalizeQuestion(question)}
              questionIndex={questionIndex}
              onUpdate={(value) => updateQuestion(questionIndex, value)}
              onDelete={() => deleteQuestion(questionIndex)}
            />
          ))
        ) : (
          <p className="rounded-md bg-white p-3 text-sm text-slate-500">No question yet. Add MCQ, true/false or another question type.</p>
        )}
      </div>
    </div>
  );
}

function normalizeQuestion(question: CurriculumQuizQuestion): CurriculumQuizQuestion {
  if (question.type === "true_false") {
    return {
      ...question,
      choices: ["True", "False"],
      answer: question.answer === "False" ? "False" : "True",
      answers: [question.answer === "False" ? "False" : "True"],
    };
  }

  if (question.type === "short_answer") {
    return {
      ...question,
      choices: [],
      answers: [],
    };
  }

  if (question.type === "multiple_choice") {
    return {
      ...question,
      choices: question.choices?.length ? question.choices : ["Option 1", "Option 2"],
      answers: question.answers?.length ? question.answers : question.answer ? [question.answer] : [],
    };
  }

  return {
    ...question,
    choices: question.choices?.length ? question.choices : ["Option 1", "Option 2"],
    answer: question.answer || question.choices?.[0] || "Option 1",
  };
}

function QuestionEditor({
  question,
  questionIndex,
  onUpdate,
  onDelete,
}: {
  question: CurriculumQuizQuestion;
  questionIndex: number;
  onUpdate: (value: Partial<CurriculumQuizQuestion>) => void;
  onDelete: () => void;
}) {
  const choices = question.choices || [];

  function updateChoice(choiceIndex: number, value: string) {
    const oldChoice = choices[choiceIndex];
    const nextChoices = choices.map((choice, index) => (index === choiceIndex ? value : choice));
    const nextValue: Partial<CurriculumQuizQuestion> = { choices: nextChoices };

    if (question.answer === oldChoice) nextValue.answer = value;
    if (question.answers?.includes(oldChoice)) {
      nextValue.answers = question.answers.map((answer) => (answer === oldChoice ? value : answer));
    }

    onUpdate(nextValue);
  }

  function toggleMultipleAnswer(choice: string) {
    const currentAnswers = question.answers || [];
    onUpdate({
      answers: currentAnswers.includes(choice)
        ? currentAnswers.filter((answer) => answer !== choice)
        : [...currentAnswers, choice],
    });
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500">Question {questionIndex + 1}</p>
        <button type="button" onClick={onDelete} className="text-xs font-medium text-rose-600">
          Delete
        </button>
      </div>
      <div className="mt-3 space-y-3">
        <label className={labelClass}>Question type</label>
        <select
          value={question.type}
          onChange={(event) => onUpdate(defaultQuestionTypePayload(event.target.value as CurriculumQuestionType))}
          className={inputClass}
        >
          <option value="single_choice">MCQ single answer</option>
          <option value="multiple_choice">Multiple select</option>
          <option value="true_false">True / False</option>
          <option value="short_answer">Short answer / Fill blank</option>
        </select>
        <label className={labelClass}>Question</label>
        <textarea
          value={question.question || ""}
          onChange={(event) => onUpdate({ question: event.target.value })}
          className={textareaClass}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Mark</label>
            <input
              type="number"
              min={0}
              value={question.mark || 1}
              onChange={(event) => onUpdate({ mark: Number(event.target.value) })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Media URL</label>
            <input
              value={question.mediaUrl || ""}
              onChange={(event) => onUpdate({ mediaUrl: event.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {question.type === "short_answer" ? (
          <div>
            <label className={labelClass}>Accepted answer</label>
            <input
              value={question.answer || ""}
              onChange={(event) => onUpdate({ answer: event.target.value })}
              className={inputClass}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Answer options</label>
              {question.type !== "true_false" ? (
                <button
                  type="button"
                  onClick={() => onUpdate({ choices: [...choices, `Option ${choices.length + 1}`] })}
                  className="text-xs font-medium text-emerald-700"
                >
                  + Option
                </button>
              ) : null}
            </div>
            {choices.map((choice, choiceIndex) => (
              <div key={`${choice}-${choiceIndex}`} className="flex items-center gap-2">
                {question.type === "multiple_choice" ? (
                  <input
                    type="checkbox"
                    checked={question.answers?.includes(choice) || false}
                    onChange={() => toggleMultipleAnswer(choice)}
                    className="h-4 w-4"
                  />
                ) : (
                  <input
                    type="radio"
                    checked={question.answer === choice}
                    onChange={() => onUpdate({ answer: choice, answers: [choice] })}
                    className="h-4 w-4"
                  />
                )}
                <input
                  value={choice}
                  disabled={question.type === "true_false"}
                  onChange={(event) => updateChoice(choiceIndex, event.target.value)}
                  className={inputClass}
                />
                {question.type !== "true_false" ? (
                  <button
                    type="button"
                    onClick={() => onUpdate({ choices: choices.filter((_, index) => index !== choiceIndex) })}
                    className="h-10 rounded-md px-2 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <label className={labelClass}>Hint</label>
        <input
          value={question.hint || ""}
          onChange={(event) => onUpdate({ hint: event.target.value })}
          className={inputClass}
        />
        <label className={labelClass}>Explanation / review note</label>
        <textarea
          value={question.explanation || ""}
          onChange={(event) => onUpdate({ explanation: event.target.value })}
          className={textareaClass}
        />
      </div>
    </div>
  );
}

function defaultQuestionTypePayload(type: CurriculumQuestionType): Partial<CurriculumQuizQuestion> {
  const defaults = defaultQuizQuestion(1, type);
  return {
    type,
    choices: defaults.choices,
    answer: defaults.answer,
    answers: defaults.answers,
  };
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex h-10 cursor-pointer items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4" />
    </label>
  );
}

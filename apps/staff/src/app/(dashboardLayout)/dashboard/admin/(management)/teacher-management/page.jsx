"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Globe2,
  Pencil,
  Search,
  Settings,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserPlus,
} from "lucide-react";

import { DateConversionWithTime } from "@/utils/DateConversionWithTime";
import TeacherModal from "@/components/AdminDashboard/TeacherManagement/TeacherModal";
import ViewDetails from "@/components/AdminDashboard/TeacherManagement/ViewDetails";
import {
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "@/services/teacherService";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Switch } from "@/components/UI/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import {
  formatWhatsappNumber,
  getBrandName,
  getProfileStatusLabel,
  getTeacherBrandKeys,
  getTeacherProfileCompletion,
  getTeacherPublicStatus,
} from "@/components/AdminDashboard/TeacherManagement/teacherProfileUtils";

const profileTone = (completion) => {
  if (completion >= 100) return "text-emerald-700";
  if (completion >= 70) return "text-blue-700";
  if (completion >= 35) return "text-amber-700";
  return "text-rose-700";
};

const accountBadge = (teacher) => {
  if (teacher.isBlock) {
    return <Badge variant="destructive">Blocked</Badge>;
  }

  if (teacher.teacherOfTheMonth) {
    return <Badge className="bg-amber-500 text-white">Teacher of month</Badge>;
  }

  return <Badge variant="outline">Active</Badge>;
};

const TeacherBrandBadges = ({ teacher }) => (
  <div className="flex flex-wrap gap-1.5">
    {getTeacherBrandKeys(teacher).map((brandKey) => (
      <Badge key={brandKey} variant="outline" className="bg-slate-50 dark:bg-slate-900">
        <Globe2 className="mr-1 size-3" />
        {getBrandName(brandKey)}
      </Badge>
    ))}
  </div>
);

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalMode, setModalMode] = useState("basic");
  const [viewTeacher, setViewTeacher] = useState(null);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTeachers();
      setTeachers(response.data?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Could not load teachers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return teachers;

    return teachers.filter((teacher) =>
      [
        teacher.name,
        teacher.email,
        teacher.number,
        teacher.whatsappNumber,
        teacher.teacherId,
        teacher.Department,
        teacher.expert,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [search, teachers]);

  const openEdit = (teacher, mode) => {
    setSelectedTeacher(teacher);
    setModalMode(mode);
  };

  const handleDelete = async (email) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await deleteTeacher(email);
      await loadTeachers();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error deleting teacher"
      );
    }
  };

  const handleToggleBlock = async (teacher) => {
    try {
      await updateTeacher({
        ...teacher,
        role: "teacher",
        isBlock: !teacher.isBlock,
      });
      await loadTeachers();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error updating teacher. Please try again."
      );
    }
  };

  const handleTogglePublicStatus = async (teacher) => {
    try {
      await updateTeacher({
        ...teacher,
        role: "teacher",
        isTeacherProfileActive: teacher.isTeacherProfileActive === false,
      });
      await loadTeachers();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Error updating teacher visibility. Please try again."
      );
    }
  };

  return (
    <div className="w-full space-y-5 px-3 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Management</p>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            Teacher Management
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">
            View all teachers in one place, update core information, and complete
            long profile details without using the old boxed table.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search teacher..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </div>
          <Button asChild>
            <Link href="/dashboard/admin/add-teacher">
              <UserPlus className="mr-2 size-4" />
              Add teacher
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div>
            <h2 className="font-semibold text-slate-950 dark:text-white">
              Teachers
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredTeachers.length} of {teachers.length} teachers
            </p>
          </div>
          <Badge variant="outline">No pagination</Badge>
        </div>

        <div className="hidden xl:block">
          <div className="grid grid-cols-[56px_1.15fr_1.15fr_0.9fr_120px_150px_150px_190px_280px] gap-4 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800">
            <div>SL</div>
            <div>Teacher</div>
            <div>Contact</div>
            <div>Department</div>
            <div>Join</div>
            <div>Profile</div>
            <div>Status</div>
            <div>Brands</div>
            <div>Actions</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading teachers...</div>
          ) : filteredTeachers.length ? (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredTeachers.map((teacher, index) => {
                const completion = getTeacherProfileCompletion(teacher);
                const joinDate = DateConversionWithTime(teacher.joiningDate);

                return (
                  <div
                    key={teacher._id || teacher.email || index}
                    className="grid grid-cols-[56px_1.15fr_1.15fr_0.9fr_120px_150px_150px_190px_280px] items-center gap-4 px-4 py-4 text-sm"
                  >
                    <div className="font-mono text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950 dark:text-white">
                        {teacher.name || "Unnamed teacher"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {teacher.teacherId || "No teacher ID"}
                      </p>
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-slate-800 dark:text-slate-200">
                        {teacher.email ? teacher.email.toLowerCase() : "No email"}
                      </p>
                      <p className="font-mono text-xs text-slate-500">
                        {teacher.number || "No phone"}
                      </p>
                      <p className="font-mono text-xs text-slate-500">
                        WA: {formatWhatsappNumber(teacher)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-slate-800 dark:text-slate-200">
                        {teacher.Department || "Not set"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {teacher.expert || teacher.institution || "No expertise"}
                      </p>
                    </div>
                    <div>
                      {joinDate === "Not set" ? (
                        <Badge variant="outline">Not set</Badge>
                      ) : (
                        <span className="text-slate-800 dark:text-slate-200">
                          {joinDate}
                        </span>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => openEdit(teacher, "profile")}
                        className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 p-2 text-left transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-950/20"
                      >
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            background: `conic-gradient(#10b981 ${completion}%, #e2e8f0 0)`,
                          }}
                        >
                          <span className="flex size-8 items-center justify-center rounded-full bg-white dark:bg-slate-950">
                            {completion}%
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold ${profileTone(
                              completion
                            )}`}
                          >
                            {getProfileStatusLabel(completion)}
                          </p>
                          <p className="text-xs text-slate-500">Complete profile</p>
                        </div>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={teacher.isTeacherProfileActive !== false}
                          onCheckedChange={() => handleTogglePublicStatus(teacher)}
                        />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {getTeacherPublicStatus(teacher)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Public profile
                      </p>
                    </div>
                    <div>
                      <TeacherBrandBadges teacher={teacher} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="w-full">{accountBadge(teacher)}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(teacher, "basic")}
                      >
                        <Pencil className="mr-1 size-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(teacher, "profile")}
                      >
                        <Settings className="mr-1 size-3.5" />
                        Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewTeacher(teacher)}
                      >
                        <Eye className="mr-1 size-3.5" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant={teacher.isBlock ? "outline" : "secondary"}
                        onClick={() => handleToggleBlock(teacher)}
                      >
                        {teacher.isBlock ? (
                          <ShieldCheck className="mr-1 size-3.5" />
                        ) : (
                          <ShieldOff className="mr-1 size-3.5" />
                        )}
                        {teacher.isBlock ? "Unblock" : "Block"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(teacher.email)}
                      >
                        <Trash2 className="mr-1 size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No teachers found.</div>
          )}
        </div>

        <div className="divide-y divide-slate-200 xl:hidden dark:divide-slate-800">
          {loading ? (
            <div className="p-6 text-center text-slate-500">Loading teachers...</div>
          ) : filteredTeachers.length ? (
            filteredTeachers.map((teacher, index) => {
              const completion = getTeacherProfileCompletion(teacher);
              const joinDate = DateConversionWithTime(teacher.joiningDate);

              return (
                <div key={teacher._id || teacher.email || index} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono text-slate-500">
                        #{String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                        {teacher.name || "Unnamed teacher"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {teacher.teacherId || "No teacher ID"}
                      </p>
                    </div>
                    {accountBadge(teacher)}
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="break-all text-slate-900 dark:text-slate-100">
                        {teacher.email ? teacher.email.toLowerCase() : "No email"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone / WhatsApp</p>
                      <p className="font-mono text-slate-900 dark:text-slate-100">
                        {teacher.number || "No phone"}
                      </p>
                      <p className="font-mono text-slate-500">
                        WA: {formatWhatsappNumber(teacher)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="text-slate-900 dark:text-slate-100">
                        {teacher.Department || "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Joining Date</p>
                      <p className="text-slate-900 dark:text-slate-100">
                        {joinDate}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEdit(teacher, "profile")}
                    className="mt-4 flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left dark:border-slate-800"
                  >
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: `conic-gradient(#10b981 ${completion}%, #e2e8f0 0)`,
                      }}
                    >
                      <span className="flex size-9 items-center justify-center rounded-full bg-white dark:bg-slate-950">
                        {completion}%
                      </span>
                    </div>
                    <div>
                      <p className={`font-semibold ${profileTone(completion)}`}>
                        {getProfileStatusLabel(completion)}
                      </p>
                      <p className="text-sm text-slate-500">Complete Profile</p>
                    </div>
                  </button>

                  <div className="mt-4 grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-2 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Public profile
                        </p>
                        <p className="text-xs text-slate-500">
                          {getTeacherPublicStatus(teacher)}
                        </p>
                      </div>
                      <Switch
                        checked={teacher.isTeacherProfileActive !== false}
                        onCheckedChange={() => handleTogglePublicStatus(teacher)}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Brands
                      </p>
                      <TeacherBrandBadges teacher={teacher} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(teacher, "basic")}
                    >
                      Edit Basic
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewTeacher(teacher)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant={teacher.isBlock ? "outline" : "secondary"}
                      onClick={() => handleToggleBlock(teacher)}
                    >
                      {teacher.isBlock ? "Unblock" : "Block"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(teacher.email)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-500">No teachers found.</div>
          )}
        </div>
      </div>

      {selectedTeacher && (
        <TeacherModal
          teacher={selectedTeacher}
          mode={modalMode}
          onClose={() => setSelectedTeacher(null)}
          onUpdated={loadTeachers}
        />
      )}

      <Dialog open={!!viewTeacher} onOpenChange={() => setViewTeacher(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
          </DialogHeader>
          {viewTeacher && <ViewDetails userData={viewTeacher} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherManagement;

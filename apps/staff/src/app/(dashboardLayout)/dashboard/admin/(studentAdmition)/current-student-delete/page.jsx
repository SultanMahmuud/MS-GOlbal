"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  User, Calendar, MapPin, BookOpen, Clock, Tag, 
  Search, Trash2, Edit3, Loader2, Sparkles, UserCheck, 
  BarChart3, Layers, Users, X, Check, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/current-students`;

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null); // Whole object when editing
  const [editForm, setEditForm] = useState({
    name: "",
    subject: "",
    date: "",
    location: "",
    time: "",
    classType: "",
    gender: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isClassTypeOpen, setIsClassTypeOpen] = useState(false);

  // Fetch all students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch students directory");
    } finally {
      setLoading(false);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student profile?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Student profile deleted successfully");
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(data.message || "Failed to delete student");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  // Start editing
  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      name: student.name || "",
      subject: student.subject || "",
      date: student.date || "",
      location: student.location || "",
      time: student.time || "",
      classType: student.classType || "",
      gender: student.gender || "",
    });
  };

  // Update student
  const handleUpdate = async (id) => {
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Student profile updated successfully");
        setStudents((prev) =>
          prev.map((s) => (s._id === id ? { ...s, ...editForm } : s))
        );
        setEditingStudent(null);
      } else {
        toast.error(data.message || "Failed to update student");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  // Search filtering
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter((s) =>
      s.name?.toLowerCase().includes(q) ||
      s.subject?.toLowerCase().includes(q) ||
      s.location?.toLowerCase().includes(q)
    );
  }, [students, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const privateCount = students.filter(s => s.classType?.toLowerCase() === 'private' || s.classType?.toLowerCase() === 'privete').length;
    const batchCount = total - privateCount;
    const maleCount = students.filter(s => s.gender?.toLowerCase() === 'male').length;
    const femaleCount = total - maleCount;
    return { total, privateCount, batchCount, maleCount, femaleCount };
  }, [students]);

  // Get name initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  // Get dynamic avatar gradient class based on name hash
  const getAvatarGradient = (name) => {
    const gradients = [
      "from-emerald-400 to-teal-500",
      "from-indigo-400 to-purple-500",
      "from-amber-400 to-orange-500",
      "from-rose-400 to-pink-500",
      "from-sky-400 to-blue-500",
    ];
    if (!name) return gradients[0];
    const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-8 h-8 text-emerald-600" />
          Student Directory
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage, filter, and edit active student registrations and schedules.
        </p>
      </div>

      {/* ── Stats Row ── */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Students</span>
              <p className="text-xl font-black text-slate-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Private Sessions</span>
              <p className="text-xl font-black text-slate-800">{stats.privateCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Batch Classes</span>
              <p className="text-xl font-black text-slate-800">{stats.batchCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Male / Female</span>
              <p className="text-xl font-black text-slate-800">{stats.maleCount}m / {stats.femaleCount}f</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Filter Controls ── */}
      {!loading && students.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student directory by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all shadow-sm"
          />
        </div>
      )}

      {/* ── Directory Layout ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="bg-white border rounded-2xl p-5 animate-pulse space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">Directory is empty</h3>
          <p className="text-slate-400 text-sm">Add students via the registration form to build the directory.</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-600">No matching profiles</h3>
          <p className="text-slate-400 text-xs">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const isPrivate = student.classType?.toLowerCase() === 'private' || student.classType?.toLowerCase() === 'privete';
            const genderStyle = student.gender?.toLowerCase() === 'male' 
              ? "bg-sky-50 text-sky-700 border-sky-100" 
              : student.gender?.toLowerCase() === 'female'
                ? "bg-rose-50 text-rose-700 border-rose-100"
                : "bg-slate-50 text-slate-500 border-slate-100";
            
            return (
              <div
                key={student._id}
                className="group bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative"
              >
                <div>
                  {/* Top Header Card */}
                  <div className="flex gap-4 items-start pb-4 border-b border-slate-50">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarGradient(student.name)} text-white font-black flex items-center justify-center text-sm shadow-md shadow-emerald-500/5`}>
                      {getInitials(student.name)}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-slate-800 text-[15px] truncate group-hover:text-emerald-700 transition-colors">
                        {student.name}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">{student.subject}</p>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="py-4 space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{student.location || "No Location Specified"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Joined: {student.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Schedule: {student.time}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Badges & Actions */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-4">
                  {/* Badges */}
                  <div className="flex gap-1.5 overflow-hidden">
                    <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-extrabold border capitalize ${
                      isPrivate ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {isPrivate ? "Private" : "Batch"}
                    </span>

                    {student.gender && (
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-extrabold border capitalize ${genderStyle}`}>
                        {student.gender}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors cursor-pointer border border-slate-100"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      disabled={deletingId === student._id}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer border border-rose-100"
                      title="Delete Profile"
                    >
                      {deletingId === student._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── Dialog Edit Modal Overlay ── */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setEditingStudent(null)} />
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-100 hover:scale-105 transition-all z-20 cursor-pointer"
              onClick={() => setEditingStudent(null)}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Edit Student Registration</h2>
                <p className="text-slate-500 text-xs mt-1">Modify active student schedule, location, and metadata.</p>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className={labelStyles}>Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={inputStyles}
                  />
                </div>

                {/* Grid attributes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Subject */}
                  <div>
                    <label className={labelStyles}>Subject *</label>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className={inputStyles}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className={labelStyles}>Location *</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className={inputStyles}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className={labelStyles}>Enrollment Date *</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      className={inputStyles}
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className={labelStyles}>Schedule Time *</label>
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      className={inputStyles}
                    />
                  </div>
                </div>

                {/* Class Type custom select dropdown */}
                <div>
                  <label className={labelStyles}>Class Type *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsClassTypeOpen(!isClassTypeOpen)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className={editForm.classType ? "text-slate-800 font-semibold capitalize" : "text-slate-400"}>
                        {editForm.classType || "Select Class Type"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>

                    {isClassTypeOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsClassTypeOpen(false)} />
                        <div className="absolute z-40 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1">
                          {["private", "batch"].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => {
                                setEditForm({ ...editForm, classType: type });
                                setIsClassTypeOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between capitalize ${
                                editForm.classType === type ? "bg-slate-50/80 text-emerald-600 font-bold" : "text-slate-700"
                              }`}
                            >
                              <span>{type}</span>
                              {editForm.classType === type && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Gender custom select dropdown */}
                <div>
                  <label className={labelStyles}>Gender *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsGenderOpen(!isGenderOpen)}
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span className={editForm.gender ? "text-slate-800 font-semibold capitalize" : "text-slate-400"}>
                        {editForm.gender || "Select Gender"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>

                    {isGenderOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsGenderOpen(false)} />
                        <div className="absolute z-40 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1">
                          {["male", "female"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setEditForm({ ...editForm, gender: g });
                                setIsGenderOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between capitalize ${
                                editForm.gender === g ? "bg-slate-50/80 text-emerald-600 font-bold" : "text-slate-700"
                              }`}
                            >
                              <span>{g}</span>
                              {editForm.gender === g && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                <button
                  onClick={() => setEditingStudent(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(editingStudent._id)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98] cursor-pointer text-sm"
                >
                  <Sparkles className="w-4.5 h-4.5" />
                  Save Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageStudents;

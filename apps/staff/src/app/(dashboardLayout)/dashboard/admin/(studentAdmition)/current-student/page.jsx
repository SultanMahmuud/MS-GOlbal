'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, Calendar, MapPin, BookOpen, Clock, Tag, 
  ChevronDown, Check, Loader2, Sparkles, UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

const CurrentStudentForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState("");
  const [classType, setClassType] = useState("");
  
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isClassTypeOpen, setIsClassTypeOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const onSubmit = async (data) => {
    if (!gender) {
      toast.error("Please select a gender");
      return;
    }
    if (!classType) {
      toast.error("Please select a class type");
      return;
    }

    setLoading(true);
    const finalData = {
      ...data,
      gender,
      classType
    };

    try {
      const response = await fetch(`${API_BASE}/api/current-students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Student registered successfully!");
        reset();
        setGender("");
        setClassType("");
      } else {
        toast.error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error or server issue');
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1";

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserCheck className="w-8 h-8 text-emerald-600" />
          Student Registration
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Add new active students to the platform directory and configure class details.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className={labelStyles}>
                <User className="w-3.5 h-3.5 text-slate-400" />
                Student Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                placeholder="e.g. Anas Bin"
                className={inputStyles}
              />
              {errors.name && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Date */}
            <div>
              <label className={labelStyles}>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Enrollment Date *
              </label>
              <input
                {...register('date', { required: 'Date is required' })}
                type="date"
                className={inputStyles}
              />
              {errors.date && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.date.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className={labelStyles}>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Location *
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                placeholder="e.g. London, UK"
                className={inputStyles}
              />
              {errors.location && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.location.message}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className={labelStyles}>
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Subject / Course *
              </label>
              <input
                {...register('subject', { required: 'Subject is required' })}
                type="text"
                placeholder="e.g. কোরআন শিক্ষা"
                className={inputStyles}
              />
              {errors.subject && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.subject.message}</p>}
            </div>

            {/* Class Type Custom Dropdown */}
            <div>
              <label className={labelStyles}>
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Class Type *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsClassTypeOpen(!isClassTypeOpen)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className={classType ? "text-slate-800 font-semibold" : "text-slate-400"}>
                    {classType || "Select class type"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isClassTypeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isClassTypeOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsClassTypeOpen(false)} />
                    <div className="absolute z-45 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1">
                      {["private", "batch"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setClassType(type);
                            setIsClassTypeOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between capitalize ${
                            classType === type ? "bg-slate-50/80 text-emerald-600 font-bold" : "text-slate-700"
                          }`}
                        >
                          <span>{type}</span>
                          {classType === type && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Gender Custom Dropdown */}
            <div>
              <label className={labelStyles}>
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                Gender *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGenderOpen(!isGenderOpen)}
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span className={gender ? "text-slate-800 font-semibold" : "text-slate-400"}>
                    {gender || "Select gender"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isGenderOpen ? 'rotate-180' : ''}`} />
                </button>

                {isGenderOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsGenderOpen(false)} />
                    <div className="absolute z-45 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1">
                      {["male", "female"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setGender(g);
                            setIsGenderOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between capitalize ${
                            gender === g ? "bg-slate-50/80 text-emerald-600 font-bold" : "text-slate-700"
                          }`}
                        >
                          <span>{g}</span>
                          {gender === g && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Time */}
            <div>
              <label className={labelStyles}>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Class Time *
              </label>
              <input
                {...register('time', { required: 'Time is required' })}
                type="time"
                className={inputStyles}
              />
              {errors.time && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.time.message}</p>}
            </div>

            {/* Label */}
            <div>
              <label className={labelStyles}>
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Label / Tag *
              </label>
              <input
                {...register('label', { required: 'Label is required' })}
                type="text"
                placeholder="e.g. Batch A"
                className={inputStyles}
              />
              {errors.label && <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.label.message}</p>}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-3">
            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/15 active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Register Student
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

// Helper components for Select imports
const Layers = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-10 5 10 5 10-5-10-5Z" />
    <path d="m2 17 10 5 10-5" />
    <path d="m2 12 10 5 10-5" />
  </svg>
);

export default CurrentStudentForm;

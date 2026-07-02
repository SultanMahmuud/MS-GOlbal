'use client'

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  User, Mail, Phone, MapPin, Calendar, Building2, 
  Lock, BookOpen, Eye, EyeOff, UserPlus, Loader2, Sparkles,
  CalendarDays
} from "lucide-react";
import { toast } from "sonner";

const RegisterStudent = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            role: "student",
            password: data.password || "student",
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Student account registered successfully!");
        reset();
      } else {
        toast.error(result.error || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error or server issue");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserPlus className="w-8 h-8 text-emerald-600" />
          Create Student Account
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Register new student login credentials and set initial academic parameters.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className={labelStyles}>
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name *
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="e.g. Ayaan Nafim"
                className={inputStyles}
              />
              {errors.name && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={labelStyles}>
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address *
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="e.g. student@gmail.com"
                className={inputStyles}
              />
              {errors.email && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className={labelStyles}>
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Phone Number *
              </label>
              <input
                {...register("number", { required: "Phone Number is required" })}
                type="text"
                placeholder="e.g. 017XXXXXXXX"
                className={inputStyles}
              />
              {errors.number && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.number.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className={labelStyles}>
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Location *
              </label>
              <input
                {...register("location", { required: "Location is required" })}
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                className={inputStyles}
              />
              {errors.location && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className={labelStyles}>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Age *
              </label>
              <input
                {...register("age", { required: "Age is required" })}
                type="number"
                placeholder="e.g. 12"
                className={inputStyles}
              />
              {errors.age && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* Guardian Name */}
            <div>
              <label className={labelStyles}>
                <User className="w-3.5 h-3.5 text-slate-400" />
                Guardian Name *
              </label>
              <input
                {...register("guardianName", {
                  required: "Guardian Name is required",
                })}
                type="text"
                placeholder="e.g. Abul Kalam"
                className={inputStyles}
              />
              {errors.guardianName && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.guardianName.message}</p>
              )}
            </div>

            {/* Institution Name */}
            <div>
              <label className={labelStyles}>
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Institution Name *
              </label>
              <input
                {...register("institutionName", {
                  required: "Institution Name is required",
                })}
                type="text"
                placeholder="e.g. Qawmi Madrasah"
                className={inputStyles}
              />
              {errors.institutionName && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.institutionName.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={labelStyles}>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                Account Password *
              </label>
              <div className="relative">
                <input
                  {...register("password", { required: "Password is required" })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  className={`${inputStyles} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Days per week */}
            <div>
              <label className={labelStyles}>
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                Days Per Week *
              </label>
              <input
                {...register("classType", {
                  required: "Days per week is required",
                })}
                type="text"
                placeholder="e.g. 5 days"
                className={inputStyles}
              />
              {errors.classType && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.classType.message}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className={labelStyles}>
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Subject *
              </label>
              <input
                {...register("subject", { required: "Subject is required" })}
                type="text"
                placeholder="e.g. কোরআন শিক্ষা লাইভ কোর্স"
                className={inputStyles}
              />
              {errors.subject && (
                <p className="text-[11px] font-bold text-rose-500 mt-1">{errors.subject.message}</p>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/15 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Account...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Register Account
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default RegisterStudent;

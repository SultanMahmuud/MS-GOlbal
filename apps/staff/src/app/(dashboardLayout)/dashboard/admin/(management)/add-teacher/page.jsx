"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Switch } from "@/components/UI/switch";
import { createTeacher } from "@/services/teacherService";
import {
  BRAND_OPTIONS,
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
  getCountryOption,
  normalizeEmail,
  normalizePhone,
} from "@/components/AdminDashboard/TeacherManagement/teacherProfileUtils";

const initialForm = {
  name: "",
  email: "",
  number: "",
  whatsappNumber: "",
  country: DEFAULT_COUNTRY.code,
  countryCode: DEFAULT_COUNTRY.dialCode,
  gender: "Male",
  joiningDate: "",
  assignedBrandKeys: ["muslim-school"],
  isTeacherProfileActive: true,
  password: "",
};

const AddTeacherPage = () => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field, value) => {
    if (field === "country") {
      const selectedCountry = getCountryOption(value);
      setForm((current) => ({
        ...current,
        country: selectedCountry.code,
        countryCode: selectedCountry.dialCode,
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [field]: field === "email" ? normalizeEmail(value) : value,
    }));
  };

  const toggleBrand = (brandKey) => {
    setForm((current) => {
      const currentKeys = Array.isArray(current.assignedBrandKeys)
        ? current.assignedBrandKeys
        : [];
      const nextKeys = currentKeys.includes(brandKey)
        ? currentKeys.filter((key) => key !== brandKey)
        : [...currentKeys, brandKey];

      return {
        ...current,
        assignedBrandKeys: nextKeys.length ? nextKeys : ["muslim-school"],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      name: form.name.trim(),
      email: normalizeEmail(form.email),
      number: normalizePhone(form.number),
      whatsappNumber: normalizePhone(form.whatsappNumber),
      country: form.country,
      countryCode: form.countryCode,
      joiningDate: form.joiningDate,
      assignedBrandKeys: form.assignedBrandKeys,
      brandKey: form.assignedBrandKeys[0] || "muslim-school",
      isTeacherProfileActive: form.isTeacherProfileActive,
      password: form.password.trim(),
      role: "teacher",
    };

    if (
      !payload.name ||
      !payload.email ||
      !payload.number ||
      !payload.whatsappNumber ||
      !payload.country ||
      !payload.countryCode ||
      !payload.gender ||
      !payload.joiningDate ||
      !payload.password
    ) {
      toast.error("Please fill all required teacher fields.");
      return;
    }

    if (payload.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await createTeacher(payload);

      if (response.data?.success) {
        toast.success("Teacher created. Complete the profile from Teacher Management.");
        setForm(initialForm);
        router.push("/dashboard/admin/teacher-management");
      } else {
        toast.error(response.data?.message || "Teacher could not be created.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Teacher creation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-3 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Admin only</p>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
            Add Teacher
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Create the teacher account with only the required login and contact
            information. Detailed profile completion stays in Teacher Management.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/teacher-management")}
        >
          Back to teachers
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-50">
          <div className="flex size-11 items-center justify-center rounded-full bg-emerald-600 text-white">
            <UserPlus className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Required first-stage fields</h2>
            <p className="text-sm opacity-80">
              Profile documents, address, qualifications, and payment details can be
              added later from Complete Profile.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
            </span>
            <Input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Teacher full name"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Email
            </span>
            <Input
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="teacher@example.com"
              type="email"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Phone Number
            </span>
            <Input
              value={form.number}
              onChange={(event) => updateField("number", event.target.value)}
              placeholder="01710500309"
              inputMode="tel"
              type="tel"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              WhatsApp Number
            </span>
            <div className="flex overflow-hidden rounded-md border border-input bg-background">
              <span className="flex min-w-[76px] items-center justify-center border-r border-input bg-slate-50 px-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {form.countryCode}
              </span>
              <Input
                value={form.whatsappNumber}
                onChange={(event) =>
                  updateField("whatsappNumber", event.target.value)
                }
                placeholder="01710500309"
                inputMode="tel"
                type="tel"
                className="border-0 focus-visible:ring-0"
                required
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Country
            </span>
            <select
              value={form.country}
              onChange={(event) => updateField("country", event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              required
            >
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name} ({country.dialCode})
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Gender
            </span>
            <select
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Joining Date
            </span>
            <Input
              value={form.joiningDate}
              onChange={(event) => updateField("joiningDate", event.target.value)}
              type="date"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Password
            </span>
            <div className="relative">
              <Input
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="Set teacher password"
                type={showPassword ? "text" : "password"}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </label>
        </div>

        <div className="mt-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.5fr_1fr] dark:border-slate-800 dark:bg-slate-900/50">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Brand visibility
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select where this teacher profile can appear publicly.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {BRAND_OPTIONS.map((brand) => {
                const checked = form.assignedBrandKeys.includes(brand.key);
                return (
                  <button
                    key={brand.key}
                    type="button"
                    onClick={() => toggleBrand(brand.key)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                      checked
                        ? "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    }`}
                  >
                    {brand.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Public profile
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active means visible on selected brand sites.
              </p>
            </div>
            <Switch
              checked={form.isTeacherProfileActive}
              onCheckedChange={(value) =>
                updateField("isTeacherProfileActive", value)
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => setForm(initialForm)}
            disabled={loading}
          >
            Clear
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create teacher"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddTeacherPage;

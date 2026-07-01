"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Badge } from "@/components/UI/badge";
import { Switch } from "@/components/UI/switch";
import { updateTeacher } from "@/services/teacherService";
import { toast } from "sonner";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";
import {
  BRAND_OPTIONS,
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
  getCountryOption,
  getTeacherBrandKeys,
  getProfileStatusLabel,
  getTeacherProfileCompletion,
  normalizeEmail,
  normalizePhone,
  toDateInputValue,
} from "./teacherProfileUtils";

const fieldClass = "space-y-1.5";
const labelClass = "text-sm font-medium text-slate-700 dark:text-slate-200";
const sectionClass =
  "rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950";

const FormField = ({ label, children }) => (
  <label className={fieldClass}>
    <span className={labelClass}>{label}</span>
    {children}
  </label>
);

const TeacherUpdateModal = ({
  teacher,
  onClose,
  onUpdated,
  mode = "profile",
}) => {
  const { register, handleSubmit, reset } = useForm();
  const [married, setMarried] = useState("Married");
  const [gender, setGender] = useState("Male");
  const [country, setCountry] = useState(DEFAULT_COUNTRY.code);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY.dialCode);
  const [assignedBrandKeys, setAssignedBrandKeys] = useState(["muslim-school"]);
  const [isTeacherProfileActive, setIsTeacherProfileActive] = useState(true);
  const [mfsMedium, setMfsMedium] = useState("Bkash");
  const [birthCertificate, setBirthCertificate] = useState("");
  const [NID, setNid] = useState("");
  const [passport, setPassport] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const isBasicMode = mode === "basic";
  const completion = getTeacherProfileCompletion({
    ...teacher,
    married,
    gender,
    mfsMedium,
    birthCertificate,
    NID,
    passport,
    avatar,
  });

  useEffect(() => {
    if (!teacher) return;

    reset({
      ...teacher,
      email: normalizeEmail(teacher.email),
      number: normalizePhone(teacher.number),
      whatsappNumber: normalizePhone(teacher.whatsappNumber),
      country: teacher.country || DEFAULT_COUNTRY.code,
      countryCode: teacher.countryCode || DEFAULT_COUNTRY.dialCode,
      dob: toDateInputValue(teacher.dob),
      joiningDate: toDateInputValue(teacher.joiningDate),
    });
    setMarried(teacher.married || "Married");
    setGender(teacher.gender || "Male");
    const selectedCountry = getCountryOption(teacher.country || teacher.countryCode);
    setCountry(selectedCountry.code);
    setCountryCode(teacher.countryCode || selectedCountry.dialCode);
    setAssignedBrandKeys(getTeacherBrandKeys(teacher));
    setIsTeacherProfileActive(teacher.isTeacherProfileActive !== false);
    setMfsMedium(teacher.mfsMedium || "Bkash");
    setBirthCertificate(teacher.birthCertificate || "");
    setNid(teacher.NID || "");
    setPassport(teacher.passport || "");
    setAvatar(teacher.avatar || "");
  }, [teacher, reset]);

  const handleCountryChange = (value) => {
    const selectedCountry = getCountryOption(value);
    setCountry(selectedCountry.code);
    setCountryCode(selectedCountry.dialCode);
  };

  const toggleBrand = (brandKey) => {
    setAssignedBrandKeys((current) => {
      const nextKeys = current.includes(brandKey)
        ? current.filter((key) => key !== brandKey)
        : [...current, brandKey];
      return nextKeys.length ? nextKeys : ["muslim-school"];
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...teacher,
        ...data,
        role: "teacher",
        email: normalizeEmail(data.email || teacher.email),
        number: normalizePhone(data.number),
        whatsappNumber: normalizePhone(data.whatsappNumber),
        country,
        countryCode,
        brandKey: assignedBrandKeys[0] || "muslim-school",
        assignedBrandKeys,
        isTeacherProfileActive,
        married,
        gender,
        mfsMedium,
        birthCertificate,
        NID,
        passport,
        avatar,
      };

      if (data.password?.trim()) {
        payload.password = data.password.trim();
      }

      await updateTeacher(payload);
      toast.success(
        isBasicMode
          ? "Teacher basic information updated."
          : "Teacher profile updated."
      );
      onUpdated(payload);
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Update failed."
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <Dialog open={!!teacher} onOpenChange={onClose}>
      <DialogContent
        className={
          isBasicMode
            ? "max-h-[90vh] overflow-y-auto sm:max-w-xl"
            : "max-h-[92vh] overflow-y-auto sm:max-w-5xl"
        }
      >
        <DialogHeader>
          <DialogTitle>
            {isBasicMode ? "Edit Basic Teacher Info" : "Complete Teacher Profile"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          {!isBasicMode && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                    Profile completion
                  </p>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {completion}% {getProfileStatusLabel(completion)}
                  </h3>
                </div>
                <div className="relative flex size-20 items-center justify-center rounded-full border-8 border-emerald-200 bg-white text-lg font-bold text-emerald-700 dark:border-emerald-900 dark:bg-slate-950">
                  {completion}%
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-emerald-100 dark:bg-emerald-950">
                <div
                  className="h-2 rounded-full bg-emerald-600 transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          )}

          <section className={sectionClass}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Basic Information
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Login/contact fields are controlled by admin.
                </p>
              </div>
              {!isBasicMode && <Badge variant="outline">Required first</Badge>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Name">
                <Input {...register("name")} placeholder="Teacher name" />
              </FormField>
              <FormField label="Email">
                <Input
                  {...register("email")}
                  placeholder="teacher@example.com"
                  type="email"
                />
              </FormField>
              <FormField label="Phone Number">
                <Input
                  {...register("number")}
                  placeholder="01710500309"
                  inputMode="tel"
                  type="tel"
                />
              </FormField>
              <FormField label="WhatsApp Number">
                <div className="flex overflow-hidden rounded-md border border-input bg-background">
                  <span className="flex min-w-[76px] items-center justify-center border-r border-input bg-slate-50 px-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {countryCode}
                  </span>
                  <Input
                    {...register("whatsappNumber")}
                    placeholder="01710500309"
                    inputMode="tel"
                    type="tel"
                    className="border-0 focus-visible:ring-0"
                  />
                </div>
              </FormField>
              <FormField label="Country">
                <select
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  {COUNTRY_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name} ({option.dialCode})
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Gender">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </FormField>
              <FormField label="Joining Date">
                <Input type="date" {...register("joiningDate")} />
              </FormField>
              {isBasicMode && (
                <FormField label="New Password (optional)">
                  <Input
                    {...register("password")}
                    placeholder="Leave blank to keep current password"
                    type="password"
                  />
                </FormField>
              )}
            </div>
            <div className="mt-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1.5fr_1fr] dark:border-slate-800 dark:bg-slate-900/50">
              <div>
                <p className={labelClass}>Brand visibility</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose the brand sites where this teacher profile can appear.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {BRAND_OPTIONS.map((brand) => {
                    const checked = assignedBrandKeys.includes(brand.key);
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
                  <p className={labelClass}>Public profile</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Active means visible on selected brand sites.
                  </p>
                </div>
                <Switch
                  checked={isTeacherProfileActive}
                  onCheckedChange={setIsTeacherProfileActive}
                />
              </div>
            </div>
          </section>

          {!isBasicMode && (
            <>
              <section className={sectionClass}>
                <h2 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">
                  Personal Details
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Father's Name">
                    <Input {...register("fatherName")} placeholder="Father's name" />
                  </FormField>
                  <FormField label="Date of Birth">
                    <Input type="date" {...register("dob")} />
                  </FormField>
                  <FormField label="Nationality">
                    <Input {...register("nationality")} placeholder="Nationality" />
                  </FormField>
                  <FormField label="Marital Status">
                    <select
                      value={married}
                      onChange={(e) => setMarried(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    >
                      <option value="Married">Married</option>
                      <option value="Unmarried">Unmarried</option>
                    </select>
                  </FormField>
                </div>
                <FormField label="Bio">
                  <textarea
                    {...register("bio")}
                    rows="4"
                    placeholder="Short teacher bio"
                    className="mt-1 w-full rounded-md border border-input bg-background p-3 text-sm text-foreground"
                  />
                </FormField>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">
                  Documents
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <CommonFileUpload
                    setUrl={setAvatar}
                    url={avatar}
                    label="Profile Image"
                  />
                  <CommonFileUpload
                    setUrl={setBirthCertificate}
                    url={birthCertificate}
                    label="Birth Certificate"
                  />
                  <CommonFileUpload setUrl={setNid} url={NID} label="National ID" />
                  <CommonFileUpload
                    setUrl={setPassport}
                    url={passport}
                    label="Passport"
                  />
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">
                  Address
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Country">
                    <Input {...register("perCountry")} placeholder="Country" />
                  </FormField>
                  <FormField label="District">
                    <Input {...register("perDistrict")} placeholder="District" />
                  </FormField>
                  <FormField label="Thana">
                    <Input {...register("perThana")} placeholder="Thana" />
                  </FormField>
                  <FormField label="Post Code">
                    <Input {...register("perPostCode")} placeholder="Post code" />
                  </FormField>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <FormField label="Permanent Address">
                    <Input
                      {...register("perAddressLine")}
                      placeholder="Permanent address"
                    />
                  </FormField>
                  <FormField label="Current Address">
                    <Input
                      {...register("currAddressLine")}
                      placeholder="Current address"
                    />
                  </FormField>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">
                  Qualification
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Department">
                    <Input {...register("Department")} placeholder="Department" />
                  </FormField>
                  <FormField label="Institution">
                    <Input {...register("institution")} placeholder="Institution" />
                  </FormField>
                  <FormField label="Experience">
                    <Input {...register("experience")} placeholder="Experience" />
                  </FormField>
                  <FormField label="Expertise">
                    <Input {...register("expert")} placeholder="Expertise" />
                  </FormField>
                  <FormField label="Qualification 1">
                    <Input {...register("qual2")} placeholder="Qualification 1" />
                  </FormField>
                  <FormField label="Qualification 2">
                    <Input {...register("qual3")} placeholder="Qualification 2" />
                  </FormField>
                  <FormField label="Total Students">
                    <Input {...register("totalStudents")} placeholder="Total students" />
                  </FormField>
                  <FormField label="Total Classes">
                    <Input {...register("totalClasses")} placeholder="Total classes" />
                  </FormField>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">
                  Payment and Bank
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="MFS Number">
                    <Input
                      {...register("mfsNumber")}
                      placeholder="MFS number"
                      inputMode="tel"
                    />
                  </FormField>
                  <FormField label="MFS Medium">
                    <select
                      value={mfsMedium}
                      onChange={(e) => setMfsMedium(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                    >
                      <option value="Bkash">Bkash</option>
                      <option value="Nagad">Nagad</option>
                    </select>
                  </FormField>
                  <FormField label="Bank Name">
                    <Input {...register("bankName")} placeholder="Bank name" />
                  </FormField>
                  <FormField label="Account Name">
                    <Input
                      {...register("bankAccountName")}
                      placeholder="Account name"
                    />
                  </FormField>
                  <FormField label="Account Number">
                    <Input
                      {...register("bankAccountNum")}
                      placeholder="Account number"
                      inputMode="numeric"
                    />
                  </FormField>
                  <FormField label="Branch Name">
                    <Input {...register("branchName")} placeholder="Branch name" />
                  </FormField>
                  <FormField label="Routing Number">
                    <Input
                      {...register("routingName")}
                      placeholder="Routing number"
                      inputMode="numeric"
                    />
                  </FormField>
                </div>
              </section>
            </>
          )}

          <DialogFooter className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : isBasicMode ? "Save Basic Info" : "Save Profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherUpdateModal;

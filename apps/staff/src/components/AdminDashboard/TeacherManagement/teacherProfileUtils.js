export const CORE_TEACHER_FIELDS = [
  "name",
  "email",
  "number",
  "whatsappNumber",
  "country",
  "countryCode",
  "gender",
  "joiningDate",
];

export const BRAND_OPTIONS = [
  { key: "muslim-school", name: "Muslim School" },
  { key: "quran-care", name: "Quran Care" },
  { key: "murshiid", name: "Murshiid" },
];

export const COUNTRY_OPTIONS = [
  { code: "BD", name: "Bangladesh", dialCode: "+880" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "PK", name: "Pakistan", dialCode: "+92" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { code: "QA", name: "Qatar", dialCode: "+974" },
  { code: "OM", name: "Oman", dialCode: "+968" },
  { code: "KW", name: "Kuwait", dialCode: "+965" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "US", name: "USA / Canada", dialCode: "+1" },
];

export const DEFAULT_COUNTRY = COUNTRY_OPTIONS[0];

export const getCountryOption = (countryCodeOrKey) =>
  COUNTRY_OPTIONS.find(
    (country) =>
      country.code === countryCodeOrKey || country.dialCode === countryCodeOrKey
  ) || DEFAULT_COUNTRY;

export const getTeacherBrandKeys = (teacher = {}) => {
  const keys = Array.isArray(teacher.assignedBrandKeys)
    ? teacher.assignedBrandKeys
    : teacher.assignedBrandKeys
      ? [teacher.assignedBrandKeys]
      : [];

  if (keys.length) return keys;
  return [teacher.brandKey || "muslim-school"];
};

export const getBrandName = (brandKey) =>
  BRAND_OPTIONS.find((brand) => brand.key === brandKey)?.name || brandKey;

export const getTeacherPublicStatus = (teacher = {}) =>
  teacher.isTeacherProfileActive === false ? "Inactive" : "Active";

export const formatWhatsappNumber = (teacher = {}) => {
  const number = normalizePhone(teacher.whatsappNumber);
  if (!number) return "Not set";
  return `${teacher.countryCode || DEFAULT_COUNTRY.dialCode} ${number}`.trim();
};

export const FULL_TEACHER_PROFILE_FIELDS = [
  ...CORE_TEACHER_FIELDS,
  "fatherName",
  "dob",
  "nationality",
  "married",
  "bio",
  "avatar",
  "birthCertificate",
  "NID",
  "passport",
  "perCountry",
  "perDistrict",
  "perThana",
  "perPostCode",
  "perAddressLine",
  "currAddressLine",
  "Department",
  "institution",
  "experience",
  "expert",
  "qual2",
  "qual3",
  "joiningDate",
  "mfsNumber",
  "mfsMedium",
  "bankName",
  "bankAccountName",
  "bankAccountNum",
  "branchName",
  "routingName",
];

export const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export const normalizePhone = (value) =>
  value === undefined || value === null ? "" : String(value).trim();

export const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value === undefined || value === null) return false;
  return String(value).trim().length > 0;
};

export const getTeacherProfileCompletion = (teacher = {}) => {
  const completed = FULL_TEACHER_PROFILE_FIELDS.filter((field) =>
    hasValue(teacher[field])
  ).length;

  return Math.round((completed / FULL_TEACHER_PROFILE_FIELDS.length) * 100);
};

export const getProfileStatusLabel = (percentage) => {
  if (percentage >= 100) return "Complete";
  if (percentage >= 70) return "Almost done";
  if (percentage >= 35) return "In progress";
  return "Needs info";
};

export const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

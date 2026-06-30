import * as XLSX from "xlsx";

type CellValue = string | number | boolean | Date | null | undefined;

function asText(value: CellValue) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function excelDate(value: CellValue) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "number" && value > 20000 && value < 60000) {
    const date = XLSX.SSF.parse_date_code(value);
    if (!date) return "";
    return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
  }
  return asText(value);
}

function excelTime(value: CellValue) {
  if (typeof value !== "number" || value < 0 || value >= 1) return asText(value);
  const total = Math.round(value * 24 * 60);
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export async function parseTeacherWorkbook(buffer: ArrayBuffer) {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const get = (row: number, col: number) => {
    const address = XLSX.utils.encode_cell({ r: row - 1, c: col - 1 });
    return sheet[address]?.v as CellValue;
  };
  const dayColumns = [
    { label: "Sat", col: 18 },
    { label: "Sun", col: 19 },
    { label: "Mon", col: 20 },
    { label: "Tue", col: 21 },
    { label: "Wed", col: 22 },
    { label: "Thu", col: 23 },
    { label: "Fri", col: 24 },
  ];

  const teacher = {
    id: asText(get(2, 3)),
    name: asText(get(1, 3)),
    phone: asText(get(3, 3)),
    whatsapp: asText(get(4, 3)),
    totalClassHours: Number(get(5, 3) || 0),
    lastUpdated: excelDate(get(15, 3)),
  };

  const students = Array.from({ length: 20 }, (_, index) => index + 3)
    .map((row) => ({
      id: asText(get(row, 4)),
      name: asText(get(row, 5)),
      email: asText(get(row, 6)),
      phone: asText(get(row, 7)),
      whatsapp: asText(get(row, 8)),
      parentName: asText(get(row, 9)),
      address: asText(get(row, 10)),
      age: asText(get(row, 11)),
      admissionDate: excelDate(get(row, 12)),
      classStartDate: excelDate(get(row, 13)),
      monthlyFee: Number(get(row, 14) || 0),
      duration: asText(get(row, 15)),
      startTime: excelTime(get(row, 16)),
      weeklyDays: dayColumns
        .filter((day) => asText(get(row, day.col)))
        .map((day) => day.label),
    }))
    .filter((student) => student.id && student.name);

  const progress = Array.from({ length: 13 }, (_, index) => index + 44)
    .map((row) => ({
      studentName: asText(get(row, 12)),
      currentLesson: asText(get(row, 14)),
      lastMonth: asText(get(row, 16)),
      examScore: asText(get(row, 18)),
      duaMasala: asText(get(row, 22)),
      teacherNote: asText(get(row, 26)),
    }))
    .filter((record) => record.studentName);

  const bookings = Array.from({ length: 89 }, (_, index) => index + 26).flatMap(
    (row) => {
      const time = excelTime(get(row, 2));
      if (!time) return [];

      return [
        { day: "Saturday", col: 3 },
        { day: "Sunday", col: 4 },
        { day: "Monday", col: 5 },
        { day: "Tuesday", col: 6 },
        { day: "Wednesday", col: 7 },
        { day: "Thursday", col: 8 },
        { day: "Friday", col: 9 },
      ]
        .filter((slot) => asText(get(row, slot.col)).toLowerCase() === "book")
        .map((slot) => ({ day: slot.day, time, status: "booked" }));
    },
  );

  return {
    sheetName,
    teacher,
    students,
    progress,
    bookings,
    summary: {
      studentCount: students.length,
      progressRows: progress.length,
      bookedSlots: bookings.length,
    },
  };
}

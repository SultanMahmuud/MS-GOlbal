import { NextResponse } from "next/server";
import { parseTeacherWorkbook } from "@/features/teacher-ops/lib/import-sheet";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new NextResponse("Missing .xlsx file", { status: 400 });
  }

  if (!file.name.endsWith(".xlsx")) {
    return new NextResponse("Only .xlsx files are supported", { status: 400 });
  }

  const parsed = await parseTeacherWorkbook(await file.arrayBuffer());

  return NextResponse.json(parsed);
}

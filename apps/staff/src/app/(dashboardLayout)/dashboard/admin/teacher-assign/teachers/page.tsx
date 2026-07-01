import { redirect } from "next/navigation";
import { teachers } from "@/features/teacher-ops/lib/data";

export default function Page() {
  redirect(`/dashboard/admin/teacher-assign/teachers/${teachers[0]?.id ?? "TID2511"}`);
}

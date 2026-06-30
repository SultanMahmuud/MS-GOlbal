import {
  BarChart,
  Bot,
  ClipboardList,
  Library,
  LogOut,
  SearchCode,
  SquareTerminal,
} from "lucide-react";
import { BiCategory, BiComment, BiLogIn } from "react-icons/bi";
import { FaQuestion } from "react-icons/fa";
import { MdLeaderboard, MdPayment } from "react-icons/md";
import { PiStudent } from "react-icons/pi";


export const baseSidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard/{role}/adminDashboard",
    icon: SquareTerminal,
    roles: ["admin"],
  },
  {
    title: "Course",
    url: "/dashboard/{role}/course",
    icon: Bot,
    roles: ["admin"],
    items: [
      { title: "Create New", url: "/dashboard/{role}/course/add-course" },
      { title: "Draft Course", url: "/dashboard/{role}/course/draft-course" },
    ],
  },
  {
    title: "Analytics",
    url: "/dashboard/{role}/analytics",
    icon: BarChart,
    roles: ["admin", "teacher"],
  },
  {
    title: "Teacher Ops",
    url: "/dashboard/admin/teacher-ops",
    icon: ClipboardList,
    roles: ["admin"],
    items: [
      { title: "Overview", url: "/dashboard/admin/teacher-ops" },
      { title: "Teacher Profile", url: "/dashboard/admin/teacher-ops/teachers/TID2511" },
      { title: "Curriculum", url: "/dashboard/admin/teacher-ops/curriculum" },
      { title: "Import Sheet", url: "/dashboard/admin/teacher-ops/import" },
    ],
  },
  {
    title: "Student Admition",
    url: "#",
    icon: PiStudent,
    roles: ["admin"],
    items: [
      { title: "Student Create", url: "/dashboard/{role}/student-create" },
      { title: "Student Registration", url: "/dashboard/{role}/registration-student" },
      { title: "Trail class Registration", url: "/dashboard/{role}/trail-class" },
      { title: "Current  Registration", url: "/dashboard/{role}/current-student" },
      { title: "Current Student Delete", url: "/dashboard/{role}/current-student-delete" },
    ],
  },
  {
    title: "Payment",
    url: "/dashboard/{role}/payment",
    icon: MdPayment,
    roles: ["admin"],
    items: [
      { title: "Student Payment", url: "/dashboard/{role}/student-payment" },
      { title: "Teacher Payment", url: "/dashboard/{role}/teacher-payment" },
      { title: "All Payment", url: "/dashboard/{role}/all-payment" },
      { title: "Student Monthly pay", url: "/dashboard/{role}/student-monthly-pay" },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/{role}/settings",
    icon: SearchCode,
    roles: ["teacher"],
  },
  {
    title: "Management",
    url: "/dashboard/{role}/management",
    icon: SearchCode,
    roles: ["admin"],
    items: [
      { title: "Content", url: "/dashboard/{role}/content" },
      { title: "Admin Setting", url: "/dashboard/{role}/admin-settings" },
      { title: "Student Management", url: "/dashboard/{role}/student-management" },
      { title: "Teacher Management", url: "/dashboard/{role}/teacher-management" },
      { title: "Add Teacher", url: "/dashboard/{role}/add-teacher" },
    ],
  },
  {
    title: "Blog",
    url: "/dashboard/{role}/blog",
    icon: BiLogIn,
    roles: ["admin"],
    items: [{ title: "Create Blog", url: "/dashboard/{role}/blog/add-blog" }],
  },
  {
    title: "Library",
    url: "/dashboard/{role}/library",
    icon: Library,
    roles: ["admin"],
    items: [{ title: "Add book", url: "/dashboard/{role}/library/add-book" }],
  },
  {
    title: "All Reviews",
    url: "/dashboard/{role}/add-review",
    icon: BiComment,
    roles: ["admin"],
    items: [{ title: "Create Review", url: "/dashboard/{role}/add-review/create" }],
  },
  {
    title: "F.A Question",
    url: "/dashboard/{role}/faqs",
    icon: FaQuestion,
    roles: ["admin"],
    items: [{ title: "Create FAQ", url: "/dashboard/{role}/faqs/create-faq" }],
  },
  {
    title: "Category",
    url: "/dashboard/{role}/category",
    icon: BiCategory,
    roles: ["admin"],
  },
  {
    title: "Leader Board",
    url: "/dashboard/leader-board",
    icon: MdLeaderboard,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "My Courses",
    url: "/dashboard/my-courses",
    icon: Bot,
    roles: ["teacher", "student"],
  },
  {
    title: "Teacher Operations",
    url: "/dashboard/teacher/operations",
    icon: ClipboardList,
    roles: ["teacher"],
  },
  {
    title: "Parent Portal",
    url: "/dashboard/student/parent-portal",
    icon: ClipboardList,
    roles: ["student"],
  },
  {
    title: "Sent Feedback",
    url: "/dashboard/sent-feedback",
    icon: BiComment,
    roles: ["teacher", "student"],
  },
];

export function getSidebarItems(userRole) {
  const replaceRoleInUrl = (url) => url.replace(/{role}/g, userRole);

  const recursiveReplace = (items) =>
    items
      .filter((item) => item.roles.includes(userRole))
      .map((item) => ({
        ...item,
        url: replaceRoleInUrl(item.url),
        items: item.items?.map((subItem) => ({
          ...subItem,
          url: replaceRoleInUrl(subItem.url),
        })),
      }));

  return recursiveReplace(baseSidebarItems);
}

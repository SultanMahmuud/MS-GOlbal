"use client";


import {
  BarChart,
  Bot,
  ClipboardList,
  Library,
  LogOut,
  SearchCode,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/UI/sidebar";
import { getUserInfo } from "@/services/auth.services";
import { PiStudent } from "react-icons/pi";
import { MdLeaderboard, MdPayment } from "react-icons/md";
import { BiCategory, BiComment } from "react-icons/bi";
import { FaQuestion } from "react-icons/fa";
import {  useMemo, } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/slice/authSlice";

import logo from "@/assets/Logo/Logo WH.png";
import Image from "next/image";

const baseData = {
  user: {
    name: "Name",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/admin/adminDashboard",
      icon: SquareTerminal,
      isActive: true,
      roles: ["admin"],
    },
    {
      title: "Course",
      url: "/dashboard/admin/course",
      icon: Bot,
      roles: ["admin"],
      items: [
        { title: "Create New", url: "/dashboard/admin/course/add-course" },
        { title: "Draft Course", url: "/dashboard/admin/course/draft-course" },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/admin/analytics",
      icon: BarChart,
      roles: ["admin"],
    },

    {
      title: "Student Admition",
      url: "#",
      icon: PiStudent,
      roles: ["admin"],
      items: [
        { title: "Student Create", url: "/dashboard/admin/student-create" },
        { title: "Student Registration", url: "/dashboard/admin/registration-student" },
        { title: "Trail class Registration", url: "/dashboard/admin/trail-class" },
        { title: "Current  Registration", url: "/dashboard/admin/current-student" },
        { title: "Current Student Delete", url: "/dashboard/admin/current-student-delete" },
      ],
    },

    {
      title: "Payment",
      url: "#",
      icon: MdPayment,
      roles: ["admin"],
      items: [
        { title: "Student Payment", url: "/dashboard/admin/student-payment" },
        { title: "Teacher Payment", url: "/dashboard/admin/teacher-payment" },
        { title: "All Payment ", url: "/dashboard/admin/all-payment" },
        { title: "Student Monthly pay", url: "/dashboard/admin/student-monthly-pay" },
      ],
    },
    {
      title: "Management",
      url: "#",
      icon: SearchCode,
      roles: ["admin"],
      items: [
        { title: "Content", url: "/dashboard/admin/content" },
        { title: "Admin Setting", url: "/dashboard/admin/admin-settings" },
        { title: "Users Management", url: "/dashboard/admin/all-users" },
        { title: "Student Management ", url: "/dashboard/admin/student-management" },

        { title: "Teacher Management", url: "/dashboard/admin/teacher-management" },
   
        { title: "Add Teacher", url: "/dashboard/admin/add-teacher" },
      ],
    },

    {
      title: "Library",
      url: "/dashboard/admin/library",
      icon: Library,
      roles: ["admin"],
      items: [{ title: "Add book", url: "/dashboard/admin/library/add-book" }],
    },
    {
      title: "All Reviews",
      url: "/dashboard/admin/add-review",
      icon: BiComment,
      roles: ["admin"],
      items: [{ title: "Create Review", url: "/dashboard/admin/add-review/create" }],
    },
    {
      title: "F.A Question",
      url: "/dashboard/admin/faqs",
      icon: FaQuestion,
      roles: ["admin"],
      items: [{ title: "Create FAQ", url: "/dashboard/admin/faqs/create-faq" }],
    },
    {
      title: "Category",
      url: "/dashboard/admin/category",
      icon: BiCategory,
      roles: ["admin"],
     
    },
  
  
    
    {
      title: "My Courses",
      url: "/dashboard/my-courses",
      icon: Bot,
      roles: ["teacher","student"],
    },
    {
      title: "Parent Portal",
      url: "/dashboard/student/parent-portal",
      icon: ClipboardList,
      roles: ["student"],
    },
    {
      title: "Annalytics",
      url: "/dashboard/analytics",
      icon: BarChart,
      roles: ["teacher", "student"],
    },
    {
      title: "Payment",
      url: "/dashboard/teacher/payment",
      icon: MdPayment,
      roles: ["teacher"],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: SearchCode,
      roles: ["teacher", "student"],
    },
    {
      title: "Sent Feedback",
      url: "/dashboard/sent-feedback",
      icon: BiComment,
      roles: ["teacher", "student"],
    },
  {
      title: "Leader Board",
      url: "/dashboard/leader-board",
      icon: MdLeaderboard,
      roles: ["admin",  "student"],
    },

  ],
};

export   function AppSidebar() {

  const userInfo = getUserInfo();

  const role = userInfo?.role;

  const filteredNav = useMemo(() => {
    return baseData.navMain.filter((item) => item.roles.includes(role));
  }, [role]);
const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
     router.push('/');
  };

  return (
  <div className="bg-red-400">
      <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center  max-w-full">
        <Link href="/" className="text-2xl font-bold"><Image src={logo} width={150} height={100} alt="logo" /></Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNav}/>
      </SidebarContent>
      <SidebarFooter>
        <LogOut onClick={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  </div>
  );
}

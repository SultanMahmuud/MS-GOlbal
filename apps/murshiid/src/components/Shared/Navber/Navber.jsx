"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {

  XIcon,
  LogInIcon,

} from "lucide-react";
import { Button } from "@/components/UI/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from "@/components/UI/drawer";
import AuthComponent from "@/components/Authcomponent/Authcomponent";
import { getUserInfo } from "@/services/auth.services";
import RelativeMenu from "./RelativeMenu";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/slice/authSlice";
import { useRouter, usePathname } from "next/navigation";
import logo from "@/assets/Logo/Logo.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";

import { CgMenuRightAlt } from "react-icons/cg";
import { FiHome } from "react-icons/fi";
import { MdMenuBook } from "react-icons/md";
import { IoMdPricetags } from "react-icons/io";
import { MdAutoAwesome } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { RiContactsBook3Line } from "react-icons/ri";
import { LuMessageCircleQuestion } from "react-icons/lu";

import { FaRegGrinStars } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";

import { GiSpellBook } from "react-icons/gi";

import { IoDocumentTextOutline } from "react-icons/io5";
import { RiShieldUserLine } from "react-icons/ri";
import homeIcon from "@/assets/Logo/Untitled-1/Untitled-1.png"


const menuItems = [
  { label: "আমাদের সম্পর্কে", href: "/about",icon: <MdAutoAwesome className="h-6 w-6 base1" />  },
  { label: "কোর্স", href: "/courses" ,icon: <MdMenuBook className="h-6 w-6 base1" /> },
  { label: "লাইভ ব্যাচ", href: "/live-batch",icon: <MdGroups className="h-6 w-6 base1" /> },
  { label: "প্রাইসিং", href: "/pricing",icon: <IoMdPricetags className="h-6 w-6 base1" /> },
  { label: "টিচার", href: "/teacher",icon: <RiShieldUserLine className="h-6 w-6 base1" /> },
  { label: "ভর্তি ফর্ম", href: "/student-registration" ,icon: <IoDocumentTextOutline className="h-6 w-6 base1" />},
  { label: "ফ্রি ক্লাস", href: "/trial-class",icon: <IoDocumentTextOutline className="h-6 w-6 base1" /> },
  { label: "যোগাযোগ", href: "/contact" ,icon: <RiContactsBook3Line className="h-6 w-6 base1" />},
  { label: "প্রশ্নোত্তর", href: "/frequently-asked-questions",icon: <LuMessageCircleQuestion className="h-6 w-6 base1" /> },
];

const tasksSubMenu = [
  { label: "স্টুডেন্ট রিভিউ দেখুন", href: "/review" ,icon: <FaRegGrinStars className="h-6 w-6 base1" />},
  { label: "লাইব্রেরি", href: "/show-library", icon: <MdOutlineLibraryBooks className="h-6 w-6 base1" />},
  { label: "রিডিং কোরআন", href: "/reading-quran",icon: <GiSpellBook className="h-6 w-6 base1" /> },
  { label: "অডিও কোরআন", href: "/audio-quran",icon: <GiSpellBook className="h-6 w-6 base1" /> },
];


const mobileTopMenu = [

  { label: "কোর্স", href: "/courses",},
  { label: "ফি", href: "/pricing", },
  {
    label: "ভর্তি",
    href: "/student-registration",
    
  },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    setUser(null);
    router.refresh();
  };

  useEffect(() => {
    setMobileNavOpen(false);
    setUser(getUserInfo());
  }, [pathname]);

  return (
    <>
      <div className="shadow-sm border-b bg-white sticky top-0 z-50">
        <header className="hidden md:flex w-7xl mx-auto px-4 py-3  justify-between items-center">
          <div className="text-xl font-bold">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                width={130}
                height={100}
                alt="Logo"
                className=""
              />
            </Link>
          </div>
          <nav className="flex gap-0 items-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
        px-3 py-1.5 rounded-md font-semibold text-md navColor
        transition-colors duration-200
        hover:bg-primary hover:text-white
      "
              >
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                className="
        px-3 py-1.5 rounded-md font-semibold text-md navColor
        transition-colors duration-200
        hover:bg-primary hover:text-white
      "
              >
                আরও
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {tasksSubMenu.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="
              flex items-center gap-2 px-3 py-1.5 rounded-md
              font-semibold  navColor
              transition-colors duration-200
              hover:bg-primary hover:text-white
            "
                    >
                     <div className="flex  gap-2 items-center">
              <p>{item.icon} </p>
              <p>{item.label}</p>
            </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {user ? (
            <RelativeMenu user={user} handleLogout={handleLogout} />
          ) : (
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1"
            >
              <LogInIcon className="h-5 w-5" /> লগইন
            </button>
          )}
        </header>
      </div>

      <div className="md:hidden sticky top-0 left-0 right-0 bg-white border-b shadow-sm z-50 flex justify-between items-center px-5 py-2">
        <Link href={'/'}><Image src={homeIcon} alt="home icon" height={40} width={40}/></Link>
      

        {mobileTopMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-primary font-semibold text-lg base1"
          >
            <div className="flex items-center gap-1 flex-col">
              <p>{item.label}</p>
            </div>
          </Link>
        ))}
          <Button  onClick={() => {
                  setMobileNavOpen(false);
                  setDrawerOpen(true);
                }}
                className="flex items-center gap-2 hover:text-primary text-[18px] font-semibold">লগিন</Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileNavOpen(true)}
        >
          <div className="flex items-center gap-1  hover:text-primary font-semibold text-lg navColor">
            <CgMenuRightAlt className="base1 size-9" />
            
          </div>
          
        </Button>
      </div>

      <Drawer
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        direction="right"
      >
        <DrawerContent className="p-4 max-w-2xl w-full">
          <DrawerHeader>
            <DrawerClose className="absolute top-4 right-4">
              <XIcon className="h-5 w-5" />
            </DrawerClose>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                width={130}
                height={100}
                alt="Logo"
                className=""
              />
            </Link>
          </DrawerHeader>

          <div className="space-y-2 overflow-y-auto pr-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 hover:text-primary"
              >

             <div className="flex  gap-2 items-center">
              <p>{item.icon} </p>
              <p className="text-lg font-medium">{item.label}</p>
            </div>
              </Link>
            ))}

            <div className="pt-4 border-t">
              {tasksSubMenu.map((task) => (
                <Link
                  key={task.href}
                  href={task.href}
                  className="flex items-center gap-2 py-2 hover:text-primary"
                >
                   <div className="flex  gap-2 items-center">
              <p>{task.icon} </p>
              <p className="text-lg font-medium">{task.label}</p>
            </div>
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  setMobileNavOpen(false);
                  setDrawerOpen(true);
                }}
                className="flex items-center gap-2 hover:text-primary"
              >
                <LogInIcon className="h-4 w-4" /> Login
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
        <DrawerContent className="p-4 max-w-[100%] min-w-[400px]">
          <DrawerHeader>
            <DrawerClose className="absolute top-4 right-4">
              <XIcon className="h-5 w-5" />
            </DrawerClose>
          </DrawerHeader>
          <AuthComponent />
        </DrawerContent>
      </Drawer>
    </>
  );
}

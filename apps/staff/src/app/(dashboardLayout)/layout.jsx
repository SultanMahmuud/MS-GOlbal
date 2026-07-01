"use client";
import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/UI/sidebar";

const Dashboard = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <div className="w-full">
          
          <div className="h-auto min-h-[100vh] bg-slate-100 p-5 text-slate-950 dark:bg-zinc-950 dark:text-zinc-100">
            <SidebarTrigger className="bg-primary text-white dark:bg-emerald-500 dark:text-emerald-950"/>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default Dashboard;

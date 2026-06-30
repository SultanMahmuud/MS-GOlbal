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
          
          <div className="bg-[#F5F5F5] h-auto min-h-[100vh] p-5">
            <SidebarTrigger  className="bg-primary text-white"/>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
export default Dashboard;

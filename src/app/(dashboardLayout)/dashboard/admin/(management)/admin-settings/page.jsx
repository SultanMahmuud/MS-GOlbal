'use client'

import AdminTable from "@/components/AdminDashboard/AdminSettings/AdminTable"
import AddNew from "@/components/Shared/AddNew/Addnew"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs"
import { cn } from "@/lib/utils"


const AdminSetting = () => {
  return (
    <div className="w-20%">
      <Tabs defaultValue="admins" className="w-full">
        <div className="flex flex-col md:flex-row justify-between border-b border-gray-300">
          <TabsList className="w-[250px] flex">
            <TabsTrigger
              value="admins"
              className={cn(
                'flex-1 px-4 py-2 text-sm font-semibold rounded-md',
               
              )}
            >
              Admins
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className={cn(
                'flex-1 px-4 py-2 text-sm font-semibold rounded-md',
                'data-[state=active]:bg-white data-[state=active]:text-black',
                'bg-primary text-white'
              )}
            >
              Add New
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="admins"
          className="bg-white p-4 mt-4 rounded-md shadow"
        >
          <AdminTable />
        </TabsContent>

        <TabsContent
          value="add"
          className="bg-white p-4 mt-4 rounded-md shadow"
        >
          <AddNew role={"admin"}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminSetting

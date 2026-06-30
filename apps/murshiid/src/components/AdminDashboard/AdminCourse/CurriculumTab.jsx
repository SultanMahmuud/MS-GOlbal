"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/UI/tabs"

const CurriculumTab = ({ com1, com2, com3 }) => {
  return (
    <div className="w-full mt-6">
      <Tabs defaultValue="lesson" className="w-full">
        <TabsList className="bg-white shadow rounded-md h-9 p-0">
          <TabsTrigger
            value="lesson"
            className="text-black text-sm font-medium px-4 h-9"
          >
            Lesson
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="text-black text-sm font-medium px-4 h-9"
          >
            Quiz
          </TabsTrigger>
          {/* If com3 exists (e.g., Assignment), you can add it */}
          {com3 && (
            <TabsTrigger
              value="assignment"
              className="text-black text-sm font-medium px-4 h-9"
            >
              Assignment
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent
          value="lesson"
          className="mt-3 bg-white shadow-sm rounded-md px-4 py-3"
        >
          {com1}
        </TabsContent>
        <TabsContent
          value="quiz"
          className="mt-3 bg-white shadow-sm rounded-md px-4 py-3"
        >
          {com2}
        </TabsContent>
        {com3 && (
          <TabsContent
            value="assignment"
            className="mt-3 bg-white shadow-sm rounded-md px-4 py-3"
          >
            {com3}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default CurriculumTab

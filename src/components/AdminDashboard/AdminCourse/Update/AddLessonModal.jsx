"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import AddNewLesson from "./AddNewLesson";

export default function AddLessonModal({
  open,
  setOpen,
  setNewLesson,
  newLesson,
}) {
  const [lesson, setLesson] = React.useState([]);


  React.useEffect(() => {
    if (lesson.length > 0) {
      setNewLesson(lesson[0]);
    }
  }, [lesson]);

  React.useEffect(() => {
    setLesson([]);
  }, [newLesson]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg rounded-xl shadow-lg min-w-4xl">
        <DialogHeader className="bg-blue-600 text-white p-4 rounded-t-xl">
          <DialogTitle className="font-bold">Add Lesson</DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <AddNewLesson lesson={lesson} setLesson={setLesson} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

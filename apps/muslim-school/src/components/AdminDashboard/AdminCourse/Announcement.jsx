"use client";

import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";
import { useState } from "react";


const Announcement = ({ setAnnouncement }) => {
  const [unsavedAnnouncement, setUnsavedAnnouncement] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    if (!unsavedAnnouncement.trim()) return;
    setAnnouncement(unsavedAnnouncement);
    setSaved(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Textarea
        className="min-h-[150px] text-base"
        value={unsavedAnnouncement}
        onChange={(e) => {
          setUnsavedAnnouncement(e.target.value);
          setSaved(false);
        }}
        placeholder="Write your announcement here..."
      />
      <Button
        className={`mt-4 ${saved ? "bg-green-600 hover:bg-green-700" : ""}`}
        onClick={handleSubmit}
        disabled={saved || !unsavedAnnouncement.trim()}
      >
        {saved ? "Submitted" : "Submit"}
      </Button>
    </div>
  );
};

export default Announcement;

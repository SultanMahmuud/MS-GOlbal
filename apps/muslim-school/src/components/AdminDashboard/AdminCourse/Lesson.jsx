"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/UI/button"
import JoditEditor from "jodit-react"

import CommonFilter from "@/components/common/CommonFilter"
import Fileupload from "@/components/Shared/FileUpload/FileUpload"

const Lesson = ({ lessons, setLessons, setSave, save }) => {
  const [lessonType, setLessonType] = useState("video")
  const [preview, setPreview] = useState(false)
  const [lessonTitle, setLessonTitle] = useState("")
  const [lessonContent, setLessonContent] = useState({})
  const [duration, setDuration] = useState({})
  const [noteFile, setNoteFile] = useState("")
  const [noteText, setNoteText] = useState("")

  const editor = useRef(null)
  const config = {
    buttons: ["bold", "italic", "link", "unlink", "underline", "source"],
  }

  const handleNoteText = (value) => {
    setNoteText(value)
  }

  const submitLesson = () => {
    setSave(!save)

    const newLesson = {
      lessonType: lessonType,
      title: lessonTitle,
      preview: preview,
      video: lessonContent?.url,
      duration: duration,
      noteFile,
      noteText,
      previewVideo: preview && lessonContent?.url,
    }

    setLessons([...lessons, newLesson])
    setPreview(false)
    setLessonTitle("")
    setLessonContent({})
    setDuration({})
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Column */}
      <div className="flex-1 space-y-3">
        <input
          className="w-full px-4 py-2 text-base rounded-md shadow  outline-1 outline-gray-400"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          placeholder="Lesson Title"
        />

        {lessonType === "video" && (
          <input
            className="w-full px-4 py-2 text-base rounded-md shadow  outline-1 outline-gray-400"
            placeholder="Video URL"
            value={lessonContent.url || ""}
            onChange={(e) => setLessonContent({ url: e.target.value })}
          />
        )}

        {lessonType === "note" && (
          <div>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-2 text-sm rounded-md shadow bg-white">
                Upload Note
              </span>
              <Fileupload url={noteFile} setUrl={setNoteFile} />
            </div>
            <div className="mt-4 max-w-lg w-full">
              <JoditEditor
                ref={editor}
                value={noteText}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => handleNoteText(newContent)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="flex-1 space-y-4">
        <CommonFilter
          value={lessonType}
          setValue={setLessonType}
          values={["Video", "Note"]}
        />

        {/* Duration Fields */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Duration</span>
          <input
            type="number"
            value={duration.hr || ""}
            onChange={(e) => setDuration({ ...duration, hr: e.target.value })}
            className="w-14 px-2 py-1 rounded shadow  outline-1 outline-gray-400"
            placeholder="hr"
          />
          <input
            type="number"
            value={duration.mnt || ""}
            onChange={(e) => setDuration({ ...duration, mnt: e.target.value })}
            className="w-14 px-2 py-1 rounded shadow  outline-1 outline-gray-400"
            placeholder="min"
          />
          <input
            type="number"
            value={duration.scnd || ""}
            onChange={(e) => setDuration({ ...duration, scnd: e.target.value })}
            className="w-14 px-2 py-1 rounded shadow  outline-1 outline-gray-400"
            placeholder="sec"
          />
        </div>

        {/* Preview Checkbox */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Preview</span>
          <input
            type="checkbox"
            checked={preview}
            onChange={() => setPreview(!preview)}
            className="h-4 w-4"
          />
        </div>

        {/* Save Button */}
        <Button
          className="mt-2"
          onClick={submitLesson}
          disabled={
            lessonTitle.trim().length === 0 ||
            (lessonType === "video" && !lessonContent.url)
          }
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default Lesson

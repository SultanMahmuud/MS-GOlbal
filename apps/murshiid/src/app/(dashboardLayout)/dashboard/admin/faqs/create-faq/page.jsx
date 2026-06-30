"use client"

import { Button } from "@/components/UI/button"
import { Input } from "@/components/UI/input"
import { Textarea } from "@/components/UI/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/UI/select"
import { useEffect, useRef, useState } from "react"
import axios from "axios"

const CreateFaq = () => {
  const [cat, setCat] = useState("")
  const [category, setCategory] = useState([])
  const questionRef = useRef(null)
  const answerRef = useRef(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.reverse()))
  }, [])

  const handleCreateFaq = async () => {
    const data = {
      question: questionRef.current?.value || "",
      answer: answerRef.current?.value || "",
      category: cat
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/faq`, data)
      if (response.status === 200) {
        alert("Sent data to server")
        if (questionRef.current) questionRef.current.value = ""
        if (answerRef.current) answerRef.current.value = ""
        setCat("")
      }
    } catch (error) {
      alert("Error! Something went wrong")
    }
  }

  return (
    <div className="space-y-4 p-5">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Enter title..."
          ref={questionRef}
          className="w-full"
        />

      <select
            id="contentInput"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            style={{ width: "150px", fontWeight: 600 ,border:'1px solid gray'}}
          >
            <option value="" selected>
              Category
            </option>
            {category[0]?.FAQ?.map((option) => (
              <option value={option?.category}>
                {option?.category}
              </option>
            ))}
          </select>

      </div>

      <Textarea
        placeholder="Enter answer"
        ref={answerRef}
        className="min-h-[120px]"
      />

      <div className="text-right">
        <Button onClick={handleCreateFaq}>Post</Button>
      </div>
    </div>
  )
}

export default CreateFaq

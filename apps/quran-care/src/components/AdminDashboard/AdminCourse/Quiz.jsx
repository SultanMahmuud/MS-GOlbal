"use client"

import { useState } from "react"
import { Button } from "@/components/UI/button"
import { Input } from "@/components/UI/input"
import { Label } from "@/components/UI/label"
import { Textarea } from "@/components/UI/textarea"

const Quiz = ({ setLessons, lessons, setSave, setOpen }) => {
  const [quizTitle, setQuizTitle] = useState("")
  const [question, setQuestion] = useState("")
  const [optionA, setOptionA] = useState("")
  const [optionB, setOptionB] = useState("")
  const [optionC, setOptionC] = useState("")
  const [optionD, setOptionD] = useState("")
  const [answer, setAnswer] = useState("")
  const [quiz, setQuiz] = useState([])
  const [alert, setAlert] = useState(false)

  const handleNext = () => {
    if (!question.trim() || !optionA.trim() || !optionB.trim() || !answer.trim()) {
      setAlert(true)
      return
    }

    setQuiz([
      ...quiz,
      {
        question,
        choice: [optionA, optionB, optionC, optionD],
        answer,
      },
    ])

    setQuestion("")
    setOptionA("")
    setOptionB("")
    setOptionC("")
    setOptionD("")
    setAnswer("")
    setAlert(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const finalQuizData = [
      ...quiz,
      {
        question,
        choice: [optionA, optionB, optionC, optionD],
        answer,
      },
    ]

    const newQuiz = {
      lessonType: "quiz",
      title: quizTitle,
      quizes: finalQuizData,
    }

    setLessons([...lessons, newQuiz])
    setSave(true)
    setQuiz([])
    setQuizTitle("")
    setQuestion("")
    setOptionA("")
    setOptionB("")
    setOptionC("")
    setOptionD("")
    setAnswer("")
    setOpen(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded-lg  max-w-3xl mx-auto"
    >
      <div>
        <Label htmlFor="quizTitle" className="font-semibold text-gray-700 mb-2 block">
          Quiz Title
        </Label>
        <Input
          id="quizTitle"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          placeholder="Enter quiz title"
          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <Label htmlFor="question" className="font-semibold text-gray-700 mb-2 block">
          Question
        </Label>
        <Textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type the question here"
          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["A", "B", "C", "D"].map((opt) => {
          const value = { A: optionA, B: optionB, C: optionC, D: optionD }[opt]
          const setter = {
            A: setOptionA,
            B: setOptionB,
            C: setOptionC,
            D: setOptionD,
          }[opt]

          return (
            <div key={opt}>
              <Label htmlFor={`option${opt}`} className="font-semibold text-gray-700 mb-2 block">
                Option {opt}
              </Label>
              <Input
                id={`option${opt}`}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={`Option ${opt}`}
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
          )
        })}
      </div>

      <div>
        <Label htmlFor="answer" className="font-semibold text-gray-700 mb-2 block">
          Correct Answer
        </Label>
        <Input
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Correct answer (A/B/C/D)"
          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      {alert && (
        <p className="text-sm text-red-600 font-medium">Please fill in all required fields.</p>
      )}

      <div className="flex flex-wrap gap-4 pt-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleNext}
          className="px-6"
        >
          Next
        </Button>

        {quiz.length > 0 && (
          <Button type="submit" className="px-6">
            Save
          </Button>
        )}
      </div>
    </form>
  )
}

export default Quiz

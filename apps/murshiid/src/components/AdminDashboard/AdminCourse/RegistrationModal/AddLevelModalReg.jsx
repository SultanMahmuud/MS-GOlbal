"use client"

import axios from "axios"
import { useEffect, useState } from "react"

const AddLevelModalReg = ({ open, setOpen, email }) => {
  const [levels, setLevels] = useState({})
  const [registerUser, setRegUser] = useState()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email) return

    setLoading(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/${email}`)
      .then((res) => {
        setRegUser(res?.data)
        setLevels(res?.data?.data?.levels || {})
        setError(false)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [email])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    axios
      .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/${email}`, {
        levels,
      })
      .then(() => {
        setOpen(false)
        setError(false)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }

  const levelFields = [
    "level1", "level2", "level3", "level4", "level5",
    "level6", "level7", "level9", "level10"
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {registerUser?.data?.user?.name}'s Levels
        </h2>

        <form onSubmit={handleSubmit}>
          {levelFields.map((key) => (
            <input
              key={key}
              type="text"
              placeholder={`Level ${key.replace("level", "")}`}
              className="w-full px-3 py-2 mb-3 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring focus:ring-blue-500"
              value={levels?.[key] || ""}
              onChange={(e) =>
                setLevels({ ...levels, [key]: e.target.value })
              }
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {error && (
            <p className="text-sm text-red-600 mt-2">Something went wrong. Please try again.</p>
          )}
        </form>

        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default AddLevelModalReg

"use client"

import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { columns } from "@/components/common/column"
import { DateConversionWithTime } from "@/utils/DateConversionWithTime"
import { DataTable } from "@/components/UI/data-table"
import { getUserInfo } from "@/services/auth.services"
import AddLevelModalReg from "@/components/AdminDashboard/AdminCourse/RegistrationModal/AddLevelModalReg"

const Registration = () => {
  const [registrations, setRegistrations] = useState([])
  const [openLevel, setOpenLevel] = useState(false)
  const [leveledEmail, setLeveledEmail] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  const limit = 15
  const user = React.useMemo(() => getUserInfo(), [])

  // ✅ Refetch function
  const fetchRegistrations = useCallback(() => {
    if (!user?.token) return
    const config = { headers: { authorization: `Bearer ${user.token}` } }
    setLoading(true)

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all?limit=${limit}&page=${page}`,
        config
      )
      .then((res) => {
        setRegistrations(res.data.data || [])
        setTotalPages(res.data.pagination?.totalPages || 1)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [user, page])

  // ✅ Fetch on mount and page change
  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  // Map API data
  const mappedData = registrations.map((user) => ({
    id: user._id,
    name: user?.name || "",
    email: user?.email || "",
    number: user?.number || "",
    parentName: user?.parentName || "",
    date: DateConversionWithTime(user?.updatedAt?.split?.("T")?.[0] || ""),
    address: user?.location || "",
    level: user?.levels?.level1 || "",
    age: user?.age || "",
    days: user?.attDays || "",
    time: user?.attTime || "",
    interestedSubject: user?.subject || "",
    openLevel: (email) => {
      setLeveledEmail(email)
      setOpenLevel(true)
    },
  }))

  // Apply search filter
  const filteredData = mappedData.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 w-full">
      {/* Search input */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-64"
        />
      </div>

     <DataTable columns={columns(fetchRegistrations)} data={filteredData} loading={loading} />


      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Level Modal */}
      <AddLevelModalReg
        open={openLevel}
        setOpen={setOpenLevel}
        email={leveledEmail}
      />
    </div>
  )
}

export default Registration

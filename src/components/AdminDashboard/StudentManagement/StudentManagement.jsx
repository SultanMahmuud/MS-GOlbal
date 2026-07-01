'use client'


import { Button } from "@/components/UI/button"
import axios from "axios"
import React, { useEffect, useState } from "react"


import { DataTable } from "@/components/UI/data-table"
import { Switch } from "@headlessui/react"
import SendMessage from "@/components/common/SendMessage"
import { DateConversionWithTime } from "@/utils/DateConversionWithTime"

const StudentManagement = () => {
  const [open, setOpen] = useState(false)
  const [roleUsers, setRoleUsers] = useState()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openLevel, setOpenLevel] = useState(false)
  const [leveledEmail, setLeveledEmail] = useState()
  const [fetchAgain, setFetchAgain] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/role/student`
        )
        setRoleUsers(res?.data)
        setError(false)
        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }

    fetchStudents()
  }, [openLevel, fetchAgain])

  const AddLevelToStudent = (email) => {
    setLeveledEmail(email)
    setOpenLevel(true)
  }

  const deleteStudent = async (email) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/delete`, {
        email,
      })
      setRoleUsers((prev) =>
        prev?.data?.filter((student) => student.email !== email)
      )
    } catch (err) {
      console.error(err)
    }
  }

  const viewMoreData = (email) => {
    setLeveledEmail(email)
    setOpen(true)
  }

  const handleBlock = async (value, email) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update`, {
        email,
        isBlock: !value,
      })
      setFetchAgain(!fetchAgain)
    } catch (err) {
      console.error(err)
    }
  }

  const handleStudentOfTheMonth = async (e, email) => {
    try {
      const state = e.target.checked
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/update`, {
        email,
        studentOfTheMonth: state,
      })
      setFetchAgain(!fetchAgain)
    } catch (err) {
      console.error(err)
    }
  }

  const columns = [
    {
      label: "View All",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => viewMoreData(tableMeta.rowData[3])}
          >
            View
          </Button>
        ),
      },
    },
    "Student Name",
    "ID",
    "Email",
    "Number",
    "Gender",
    "Join",
    "Subscription",
    "Tag1",
    "Tag2",
    "Tag3",
    "Tag4",
    "Tag5",
    {
      label: "Student of the Month",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Switch
            checked={value}
            onCheckedChange={(state) =>
              handleStudentOfTheMonth({ target: { checked: state } }, tableMeta.rowData[3])
            }
          />
        ),
      },
    },
    {
      label: "Add Level",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => AddLevelToStudent(tableMeta.rowData[3])}
          >
            Add Level
          </Button>
        ),
      },
    },
    {
      label: "Message",
      options: {
        customBodyRender: (value, tableMeta) => (
          <SendMessage
            data={{
              email: tableMeta.rowData[3],
              number: tableMeta.rowData[4],
            }}
          />
        ),
      },
    },
    {
      label: "Block",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Button
            variant={value ? "secondary" : "outline"}
            className="text-xs"
            onClick={() => handleBlock(value, tableMeta.rowData[3])}
          >
            {value ? "Unblock" : "Block"}
          </Button>
        ),
      },
    },
    {
      label: "Delete",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Button
            variant="destructive"
            className="text-xs"
            onClick={() => deleteStudent(tableMeta.rowData[3])}
          >
            Delete
          </Button>
        ),
      },
    },
  ]

  const studentData = roleUsers?.data
    ?.slice()
    ?.reverse()
    .map((user) => [
      "",
      user?.name || "",
      user?.studentId || "",
      user?.email || "",
      user?.number || "",
      user?.gender || "",
      DateConversionWithTime(user.enrolledDate) || "",
      user?.studentPayment?.at(-1)?.city || "",
      user?.levels?.level1 || "",
      user?.levels?.level2 || "",
      user?.levels?.level3 || "",
      user?.levels?.level4 || "",
      user?.levels?.level5 || "",
      user?.studentOfTheMonth || false,
      "",
      "",
      user?.isBlock || false,
    ])

  const options = {
    setRowProps: () => ({
      style: { textAlign: "left" },
    }),
    selectableRows: false,
    pagination: false,
    responsive: "scroll",
  }

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={studentData}
       
      />
    </div>
  )
}

export default StudentManagement

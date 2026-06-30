'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SendMessage from '@/components/common/SendMessage'
import { DataTable } from '@/components/UI/data-table'
import { DateConversionWithTime } from '@/utils/DateConversionWithTime'

const TeacherPayment = () => {
  const [paymentModal, setPaymentModal] = useState(false)
  const [email, setEmail] = useState()
  const [teacherEmail, setTeacherEmail] = useState()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true)
      try {
        const role = 'teacher'
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/role/${role}`
        )
        setTeachers(res.data?.data || [])
      } catch (error) {
        console.error('Failed to fetch teachers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  const handlePayment = (email) => {
    setEmail(email)
    setPaymentModal(true)
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'teacherId',
      header: 'Teacher ID',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'number',
      header: 'Phone',
    },
    {
      accessorKey: 'mfsNumber',
      header: 'MFS Number',
    },
    {
      accessorKey: 'totalPayment',
      header: 'Total Payment',
    },
    {
      accessorKey: 'joiningDate',
      header: 'Join Date',
    },
    {
      id: 'view',
      header: 'View Students',
      cell: ({ row }) => (
        <button
          className="px-2 py-1 text-xs rounded-md bg-white border shadow-sm hover:bg-gray-100"
          onClick={() => setTeacherEmail(row.original.email)}
        >
          View
        </button>
      ),
    },
    {
      id: 'payment',
      header: 'Payment',
      cell: ({ row }) => (
        <button
          className="px-2 py-1 text-xs rounded-md bg-white border shadow-sm hover:bg-gray-100"
          onClick={() => handlePayment(row.original.email)}
        >
          Pay
        </button>
      ),
    },
    {
      id: 'message',
      header: 'Message',
      cell: ({ row }) => (
        <SendMessage
          data={{ email: row.original.email, number: row.original.number }}
        />
      ),
    },
  ]

  const teacherData = teachers?.map((user) => ({
    name: user?.name || '',
    teacherId: user?.teacherId || '',
    email: user?.email || '',
    number: user?.number || '',
    mfsNumber: user?.mfsNumber || '',
    totalPayment:
      user?.teacherPayment?.reduce((total, curr) => total + curr.amountOfPayment, 0) || 0,
    joiningDate: DateConversionWithTime(user?.joiningDate),
  }))

  return (
    <div className="p-4">
      {loading ? (
        <p className="text-center text-gray-600">Loading teachers...</p>
      ) : (
        <DataTable columns={columns} data={teacherData} />
      )}
    </div>
  )
}

export default TeacherPayment

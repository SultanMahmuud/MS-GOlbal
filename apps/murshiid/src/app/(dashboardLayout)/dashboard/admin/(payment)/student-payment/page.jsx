'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/UI/data-table'
import SendMessage from '@/components/common/SendMessage'
import AddLevelModalReg from '@/components/AdminDashboard/AdminCourse/RegistrationModal/AddLevelModalReg'
import Image from 'next/image'



const StudentPayment = () => {
  const [open, setOpen] = useState(false)
  const [roleUsers, setRoleUsers] = useState([])
  const [email, setEmail] = useState()
  const [pricingTiers, setPricingTiers] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const role = 'student'
        const [userRes, pricingRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/role/${role}`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pricingplan`),
        ])

        setRoleUsers(userRes?.data?.data || [])
        setPricingTiers(pricingRes?.data?.data?.[0])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [open])

  const addLevel = (email) => {
    setEmail(email)
    setOpen(true)
  }

  const getEndDate = (user) => {
    const payments = user?.studentPayment
    if (!payments?.length) return ''
    const last = payments[payments.length - 1]
    const date = new Date(last?.date_time)
    date.setMonth(date.getMonth() + 1)
    return date.toISOString().split('T')[0]
  }

  const getAmount = (user) => {
    const payments = user?.studentPayment
    if (!payments?.length) return ''
    const last = payments[payments.length - 1]
    const course = user.Course.find((cr) => cr._id === last.customer_order_id)
    return course?.salePrice || ''
  }

  const getDue = (user) => {
    const payments = user?.studentPayment
    if (!payments?.length) return ''
    const last = payments[payments.length - 1]
    if (last.city === 'Monthly') {
      const totalPaid = payments.reduce((acc, cur) => acc + cur.amount, 0)
      return pricingTiers?.batch_full_price - totalPaid || 0
    }
    return ''
  }

  const getPayment = (user) => {
    const payments = user?.studentPayment
    if (!payments?.length) return ''
    return payments.reduce((acc, cur) => acc + cur.amount, 0)
  }

  const courseType = (user) => {
    return user?.Course?.map((item) => item.medium)?.join(', ') || ''
  }

  const studentData = roleUsers?.slice(0,15).map((user) => ({
    avatar: user?.avatar,
    name: user?.name || '',
    studentId: user?.studentId || '',
    email: user?.email || '',
    number: user?.number || '',
    start: user?.studentPayment[user?.studentPayment.length - 1]?.date_time?.split(' ')[0] || '',
    end: getEndDate(user),
    amount: getAmount(user),
    due: getDue(user),
    payment: getPayment(user),
    courseType: courseType(user),
    level1: user?.levels?.level1 || '',
    level2: user?.levels?.level2 || '',
    level3: user?.levels?.level3 || '',
    level4: user?.levels?.level4 || '',
    level5: user?.levels?.level5 || '',
  }))

  const columns = [
    {
      accessorKey: 'avatar',
      header: 'Student',
      cell: ({ row }) => (
        <Image
          width={32}
          height={32}
          src={row.getValue('avatar')}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'studentId',
      header: 'Student ID',
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
      accessorKey: 'start',
      header: 'Start Date',
    },
    {
      accessorKey: 'end',
      header: 'End Date',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
    {
      accessorKey: 'due',
      header: 'Due',
    },
    {
      accessorKey: 'payment',
      header: 'Payment',
    },
    {
      accessorKey: 'courseType',
      header: 'Course Type',
    },
    {
      accessorKey: 'level1',
      header: 'L1',
    },
    {
      accessorKey: 'level2',
      header: 'L2',
    },
    {
      accessorKey: 'level3',
      header: 'L3',
    },
    {
      accessorKey: 'level4',
      header: 'L4',
    },
    {
      accessorKey: 'level5',
      header: 'L5',
    },
    {
      id: 'add-level',
      header: 'Add Level',
      cell: ({ row }) => (
        <button
          className="px-2 py-1 text-xs rounded-md bg-white border shadow-sm hover:bg-gray-100"
          onClick={() => addLevel(row.original.email)}
        >
          Add Level
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

  return (
    <div className="p-4">
      <DataTable columns={columns} data={studentData} />
      <AddLevelModalReg open={open} setOpen={setOpen} email={email} />
    </div>
  )
}

export default StudentPayment

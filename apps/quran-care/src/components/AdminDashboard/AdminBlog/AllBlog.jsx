'use client'
import AdminBlog from '@/components/AdminDashboard/AdminBlog/AdminBlog'
import React, { useEffect, useState } from 'react'



const AllBlog = () => {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/getBlog`)
        const data = await res.json()
        setBlogs(data?.reverse())
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, []) 

  return (
    <div>
      {isLoading ? "Loading......." : <AdminBlog blogs={blogs} setIsLoading={setIsLoading} />}
    </div>
  )
}

export default AllBlog

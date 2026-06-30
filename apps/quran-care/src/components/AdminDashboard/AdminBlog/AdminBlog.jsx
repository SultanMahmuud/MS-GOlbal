'use client'

import React from 'react'
import axios from 'axios'
import { Button } from '@/components/UI/button'
import AdminUpdateBlog from './AdminUpdateBlog'
import Image from 'next/image'



const AdminBlog = ({ blogs, setIsLoading }) => {
  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/getBlog/${id}`)
      alert('Blog deleted successfully')
      setIsLoading(true)
    } catch (error) {
      alert('Error! Something went wrong.')
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {blogs?.map((item) => (
        <div key={item._id} className="flex flex-col justify-between shadow-md hover:shadow-lg transition duration-300">
          <div className="overflow-hidden">
            <Image
              src={item?.blogImg}
              alt="blog"
              className="w-full h-[200px] object-cover rounded-t-md transform transition-transform duration-500 hover:scale-105"
              width={1920}
              height={1080}
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-primary">{item?.blogTitle?.slice(0, 20)}</h2>
            <p
              className="text-sm text-gray-700 text-justify"
              dangerouslySetInnerHTML={{
                __html: item?.blogDescription?.slice(0, 150),
              }}
            />
            <p className="text-xs text-yellow-600 tracking-wide">
              {item?.blogAuthorName}, {item?.publishDate}
            </p>
            <div className="flex justify-between items-center pt-2">
              <Button
                size="sm"
                className="bg-primary text-white"
                onClick={() => handleDeleteBlog(item?._id)}
              >
                Delete
              </Button>
              <AdminUpdateBlog itemId={item?._id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AdminBlog

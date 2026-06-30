'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/UI/input'
import { Button } from '@/components/UI/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/UI/dialog'
import { Badge } from '@/components/UI/badge'
import JoditEditor from 'jodit-react'
import useUploads from '@/components/Hooks/useUpload'
import Image from 'next/image'


const config = {
  buttons: ['bold', 'italic', 'link', 'unlink', 'underline', 'source'],
}

const AdminUpdateBlog = ({ itemId }) => {
  const [open, setOpen] = useState(false)
  const [blogDetails, setBlogDetails] = useState({})
  const [category, setCategory] = useState([])
  const [tags, setTags] = useState([])
  const [value, setValue] = useState([])
  const [description, setDescription] = useState({})
  const [Bookmainimg1, setBookmainimg1] = useState('')
  const editor = useRef(null)
  const { handleSubmits } = useUploads()
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/getBlog/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        setBlogDetails(data)
        setBookmainimg1(data.blogImg)
      })
  }, [itemId])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.reverse()))
  }, [])

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return
    if (!e.target.value.trim()) return
    setTags([...tags, e.target.value])
    e.target.value = ''
  }

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const img1 = (e) => {
    handleSubmits(e, setBookmainimg1)
  }

  const onSubmit = (data) => {
    const newData = {
      blogTitle: data.blogTitle,
      blogImg: Bookmainimg1,
      blogAuthorName: data.blogAuthorName,
      ...description,
      blogTag: tags,
      blogCategory: value,
      publishDate: data.publishDate,
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}blogs/${itemId}`, newData)
      .then((res) => {
        if (res.status === 200) {
          alert('Blog updated successfully')
          reset()
          setOpen(false)
        }
      })
      .catch(() => alert('Something went wrong'))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary text-white">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                defaultValue={blogDetails.blogTitle}
                {...register('blogTitle', { required: true })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <JoditEditor
                ref={editor}
                value={blogDetails.blogDescription}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setDescription({ blogDescription: newContent })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                multiple
                className="w-full rounded border p-2"
                onChange={(e) =>
                  setValue(Array.from(e.target.selectedOptions, (option) => option.value))
                }
              >
                {category[0]?.blog?.map((cat, i) => (
                  <option key={i} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Author</label>
                <Input
                  defaultValue={blogDetails.blogAuthorName}
                  {...register('blogAuthorName', { required: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  defaultValue={blogDetails.publishDate}
                  {...register('publishDate', { required: true })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <span
                      className="cursor-pointer ml-1 text-red-500"
                      onClick={() => removeTag(index)}
                    >
                      &times;
                    </span>
                  </Badge>
                ))}
              </div>
              <Input placeholder="Press Enter to add tag" onKeyDown={handleKeyDown} />
            </div>

            <div>
              <label className="text-sm font-medium">Blog Image</label>
              <Input type="file" onChange={img1} />
              {Bookmainimg1 && (
                <Image src={Bookmainimg1} alt="Blog" className="mt-2 w-full h-48 object-cover rounded" width={1920} height={1080} />
              )}
            </div>

            <Button type="submit" className="w-full mt-4 bg-yellow-500 text-white">
              Update Blog
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AdminUpdateBlog

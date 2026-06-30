'use client'

import React, { useEffect, useRef, useState } from 'react'
import JoditEditor from 'jodit-react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'sonner'

import { Input } from '@/components/UI/input'
import { Button } from '@/components/UI/button'
import { Label } from '@/components/UI/label'
import { Badge } from '@/components/UI/badge'
import useUploads from '@/components/Hooks/useUpload'
import Image from 'next/image'



const config = {
  buttons: ['bold', 'italic', 'link', 'unlink', 'underline', 'source'],
}

const AddBlog = () => {
  const { handleSubmits } = useUploads()
  const editor = useRef(null)
  const [description, setDescription] = useState({})
  const [Bookmainimg1, setBookmainimg1] = useState('')
  const [tags, setTags] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])

  const { register, handleSubmit, reset } = useForm()


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => res.json())
      .then((data) => setCategoryOptions(data.data[0]?.blog || []))
  }, [])

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter') return
    const val = e.currentTarget.value.trim()
    if (!val) return
    setTags((prev) => [...prev, val])
    e.currentTarget.value = ''
  }

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = (data) => {
    const newData = {
      ...data,
      ...description,
      blogCategory: selectedCategories,
      blogTag: tags,
      blogImg: Bookmainimg1,
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blogs/createBlog`, newData)
      .then((res) => {
        if (res.status === 200) {
          alert('Blog added successfully')
          reset()
        }
      })
      .catch(() => toast.error('Something went wrong'))
  }

  const handleImageUpload = (e) => {
    handleSubmits(e, setBookmainimg1)
  }

  const handleCategoryChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value)
    setSelectedCategories(selected)
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blog Content */}
        <div className="col-span-2 space-y-4">
          <div>
            <Label>Blog Title</Label>
            <Input {...register('blogTitle', { required: true })} placeholder="Enter title" />
          </div>

          <div>
            <Label>Blog Description</Label>
            <JoditEditor
              ref={editor}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setDescription({ blogDescription: newContent })}
            />
          </div>

          <div>
            <Label>Categories</Label>
            <select
              multiple
              onChange={handleCategoryChange}
              className="w-full border rounded p-2 focus:outline-none"
            >
              {categoryOptions.map((cat, i) => (
                <option key={i} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Author</Label>
              <Input {...register('blogAuthorName', { required: true })} placeholder="Author name" />
            </div>
            <div>
              <Label>Publish Date</Label>
              <Input
                {...register('publishDate', { required: true })}
                placeholder="e.g. 22 April, 2024"
              />
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, i) => (
                <Badge key={i} className="flex items-center gap-1">
                  {tag}
                  <span
                    className="ml-1 cursor-pointer text-red-500"
                    onClick={() => removeTag(i)}
                  >
                    &times;
                  </span>
                </Badge>
              ))}
            </div>
            <Input placeholder="Press Enter to add tag" onKeyDown={handleKeyDown} />
          </div>
        </div>

        {/* Image and Submit */}
        <div className="space-y-4">
          <div>
            <Label>Upload Blog Image</Label>
            <Input type="file" onChange={handleImageUpload} />
            {Bookmainimg1 && (
              <Image
              
                src={Bookmainimg1}
                alt="Uploaded blog"
                className="mt-2 w-full h-40 object-cover rounded"
                width={1920}
                height={1080}
              />
            )}
          </div>

          <Button type="submit" className="w-full mt-4">
            Submit Blog
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddBlog

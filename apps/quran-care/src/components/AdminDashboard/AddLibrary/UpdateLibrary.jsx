'use client'
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";



import { toast } from "sonner";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });


const config = {
  buttons: ["bold", "italic", "link", "unlink", "underline", "source"],
};

const UpdateLibrary = ({ itemId, handleClose, singleBooks }) => {
const [featuredImage,setFeaturedImage] = useState(null);

  const [Bookmainimg1, setBookmainimg1] = useState(null);
  const [Bookmainimg2, setBookmainimg2] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [page, setPage] = useState("");
  const [description, setDescription] = useState();
  const [faq, setFaq] = useState();
  const [category, setCategory] = useState([]);
  const [value, setValue] = useState([]);
const [singleBook, setSingleBook] = useState(null);
  const editor = useRef(null);

// single book
axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book/${itemId}`)
  .then((res) => {
    setSingleBook(res.data);
  })
  .catch((error) => {
    console.error("Error fetching single book:", error);
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => res.json())
      .then((data) => setCategory(data.data.reverse()));
  }, []);

  const handleUpdateStudent = (id) => {
    const data = {
      title: title || singleBook?.data?.title,
      price: price || singleBook?.data?.price,
      page: page || singleBook?.data?.page,
      description: description?.description || singleBook?.data?.description,
      faq: faq?.faq || singleBook?.data?.faq,
      courseCategory: value.length > 0 ? value : singleBook?.data?.courseCategory,
      image1: Bookmainimg1 || singleBook?.data?.image1,
      fileLink: Bookmainimg2 || singleBook?.data?.fileLink,
    };

    axios
      .put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book/${id}`, data)
      .then((res) => {
        if (res.status === 201) {
          toast.success("Successfully edited");
          handleClose();
        }
      })
      .catch((error) => console.log(error));
  };

  const img2 = (e) => handleSubmits(e, setBookmainimg2);

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow-lg min-h-screen p-6 overflow-y-auto h-[40vh]">
      {/* Title */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Title</label>
        <input
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Title"
          className="w-full border border-gray-300 rounded-lg p-3"
          defaultValue={singleBook?.data?.title}
        />
      </div>

      {/* Price */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Price</label>
        <input
          onChange={(e) => setPrice(e.target.value)}
          type="text"
          placeholder="Set Price"
          className="w-full border border-gray-300 rounded-lg p-3"
          defaultValue={singleBook?.data?.price}
        />
      </div>

      {/* Page */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Page</label>
        <input
          onChange={(e) => setPage(e.target.value)}
          type="text"
          placeholder="Enter Page"
          className="w-full border border-gray-300 rounded-lg p-3"
          defaultValue={singleBook?.data?.page}
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Description</label>
        <JoditEditor
          ref={editor}
          value={singleBook?.data?.description}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setDescription({ description: newContent })}
        />
      </div>

      {/* FAQ */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">FAQ</label>
        <JoditEditor
          ref={editor}
          value={singleBook?.data?.faq}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setFaq({ faq: newContent })}
        />
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Categories</label>
        <select
          multiple
          className="w-full border border-gray-300 rounded-lg p-3"
          onChange={(e) =>
            setValue(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          defaultValue={singleBook?.data?.courseCategory}
        >
          {category[0]?.library?.map((option, idx) => (
            <option key={idx} value={option.category}>
              {option.category}
            </option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Main Image</label>
        <CommonFileUpload setUrl={setFeaturedImage} url={featuredImage} />
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">File Upload</label>
        <input type="file" onChange={img2} className="w-full" />
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => handleUpdateStudent(itemId)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
        >
          Update
        </button>
        <button
          onClick={handleClose}
          className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateLibrary;

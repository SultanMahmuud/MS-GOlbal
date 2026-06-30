"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import dynamic from "next/dynamic";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddBook = () => {
  const { register, handleSubmit, reset } = useForm();
  const [description, setDescription] = useState("");
  const [bookImages, setBookImages] = useState(["", "", ""]); // Array for cleaner mapping
  const [fileLink, setFileLink] = useState("");
  const [authors, setAuthors] = useState([""]);
  const [faq, setFaq] = useState({ tab1: "", tab2: "", tab3: "", tab4: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length > 0) setCategories(data.data[0].library || []);
      })
      .catch(err => console.error("Category fetch error:", err));
  }, []);

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const onSubmit = async (formData) => {
    const finalData = {
      ...formData,
      price: Number(formData.price),
      salePrice: Number(formData.salePrice),
      page: Number(formData.page),
      description: description,
      faq: faq.tab1 || faq.tab2 || faq.tab3 || faq.tab4,
      courseCategory: [formData.courseCategory],
      author: authors
        .filter((name) => name.trim() !== "")
        .map((name) => ({
          id: crypto.randomUUID(),
          name,
          education: "",
          description: "",
          img: "",
        })),
      image1: bookImages[0],
      image2: bookImages[1],
      image3: bookImages[2],
      fileLink,
    };

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book`, finalData);
      alert("Book added successfully!");
      reset();
      setDescription("");
      setAuthors([""]);
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to add book");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Book</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <input {...register("title")} placeholder="Book Title" className="w-full p-3 border rounded-md" required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input {...register("price")} type="number" placeholder="Price" className="p-3 border rounded-md" />
          <input {...register("salePrice")} type="number" placeholder="Sale Price" className="p-3 border rounded-md" />
          <input {...register("page")} type="number" placeholder="Page Count" className="p-3 border rounded-md" />
          <input {...register("format")} placeholder="Format (e.g. PDF)" className="p-3 border rounded-md" />
        </div>

        <div>
          <label className="block font-medium">Authors</label>
          {authors.map((auth, i) => (
            <input key={i} value={auth} onChange={(e) => handleAuthorChange(i, e.target.value)} className="w-full p-2 mb-2 border rounded-md" />
          ))}
          <button type="button" onClick={() => setAuthors([...authors, ""])} className="text-blue-500 text-sm">+ Add Author</button>
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <JoditEditor value={description} onChange={setDescription} />
        </div>

        <select {...register("courseCategory")} className="w-full p-3 border rounded-md" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.category}>{cat.category}</option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <label className="text-xs">Image {i+1}</label>
              <CommonFileUpload setUrl={(url) => {
                const newImgs = [...bookImages];
                newImgs[i] = url;
                setBookImages(newImgs);
              }} />
            </div>
          ))}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
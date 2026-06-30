"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";

const LibraryCategary = ({ featured, texteld, featured__vis, button_form }) => {
  const { register, handleSubmit, reset } = useForm();

  const [category, setCategory] = useState([]);
  const [categoryItem, setCategoryItem] = useState("false");

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch categories
useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.data?.length > 0) {
        setCategory(data.data[0].library); // directly save only courses
      }
    });
}, [categoryItem]);


  // Submit new category
  const onSubmit = (data) => {
    const newData = { ...data };
    axios
      .put(`${BASE_URL}/category/library/68af1a2bda8917c50135cebc`, newData)
      .then(() => {
        reset();
        setCategoryItem("true");
      })
      .catch(() => {
        alert("error! something went wrong");
      });
  };

  // Delete category
  const handleDeleteCours = (id) => {
    const data = {
      Id: "68af1a2bda8917c50135cebc",
    };
    axios
      .put(`${BASE_URL}/category/librarydelete/${id}`, data)
      .then((response) => {
        if (response.status === 201) {
          alert("Course Category deleted");
          setCategoryItem("true");
        }
      })
      .catch(() => {
        alert("error! something went wrong");
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left side: Add Category Form */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className={`${featured} text-lg`}>Add New Category</h2>

          <input
            type="text"
            {...register("category")}
            placeholder="Add Category"
            className={`mt-4 ${texteld} border border-gray-300 rounded px-3 py-2 w-full`}
          />

          <button type="submit" className={`${button_form} mt-2`}>
            Submit
          </button>
        </div>

        {/* Right side: Display Categories */}
        <div>
         {category.map((e, index) => (
  <div key={index} className="flex items-center gap-4 mb-2 bg-white p-2 rounded shadow">
    <button
      type="button"
      onClick={() => handleDeleteCours(e?._id)}
      className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-400 shadow bg-gray-100"
    >
      <Trash2 className="text-red-600 w-4 h-4" />
    </button>
    <p className={`${featured} text-sm`}>{e?.category}</p>
  </div>
))}

        </div>
      </div>
    </form>
  );
};

export default LibraryCategary;

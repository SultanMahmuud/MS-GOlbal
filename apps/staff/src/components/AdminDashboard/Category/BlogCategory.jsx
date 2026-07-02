"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Trash2, FolderPlus } from "lucide-react";
import { toast } from "sonner";

const BlogCategory = () => {
  const { register, handleSubmit, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    fetch(`${API_BASE}/category`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length > 0) {
          setCategories(data.data[0].blog || []);
        }
      })
      .catch((err) => console.error("Error loading blog categories:", err));
  }, [refreshTrigger, API_BASE]);

  const onSubmit = (data) => {
    setLoading(true);
    axios
      .put(`${API_BASE}/category/blog/68af1a2bda8917c50135cebc`, data)
      .then(() => {
        toast.success("Blog category added successfully");
        reset();
        setRefreshTrigger((prev) => !prev);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add category");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const data = { Id: "68af1a2bda8917c50135cebc" };
    axios
      .put(`${API_BASE}/category/blogdelete/${id}`, data)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          toast.success("Blog category deleted");
          setRefreshTrigger((prev) => !prev);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete category");
      });
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5";

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Left panel */}
      <div className="md:col-span-5 bg-slate-50/50 border border-slate-100 rounded-2xl p-6 h-fit space-y-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <FolderPlus className="w-5 h-5 shrink-0" />
          <h3 className="font-bold text-sm">Add Blog Category</h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelStyles}>Category Name</label>
            <input
              type="text"
              {...register("category", { required: true })}
              placeholder="e.g. দ্বীনি আমল ও দোয়া"
              className={inputStyles}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98] cursor-pointer text-sm"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>

      {/* Right panel */}
      <div className="md:col-span-7 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Blog Categories ({categories.length})</h3>
        <div className="max-h-[450px] overflow-y-auto pr-2 space-y-2.5">
          {categories.length > 0 ? (
            categories.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <p className="text-sm font-semibold text-slate-800">{cat.category}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 font-medium py-6 text-center">No categories defined yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCategory;

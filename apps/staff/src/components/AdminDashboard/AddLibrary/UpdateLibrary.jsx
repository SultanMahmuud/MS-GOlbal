'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";
import dynamic from "next/dynamic";
import { ChevronDown, Check, Loader2, Sparkles, X, ImageIcon, FileText } from "lucide-react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const UpdateLibrary = ({ itemId, handleClose, singleBook, refreshBooks }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [page, setPage] = useState("");
  const [description, setDescription] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [image1, setImage1] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  // Pre-populate form with pre-fetched singleBook data
  useEffect(() => {
    if (singleBook?.data) {
      const book = singleBook.data;
      setTitle(book.title || "");
      setPrice(book.price || "");
      setPage(book.page || "");
      setDescription(book.description || "");
      setSelectedCat(book.courseCategory?.[0] || "");
      setImage1(book.image1 || "");
      setFileLink(book.fileLink || "");
    }
  }, [singleBook]);

  // Load categories for dropdown list
  useEffect(() => {
    fetch(`${API_BASE}/category`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length > 0) {
          setCategoryList(data.data[0].library || []);
        }
      })
      .catch((err) => console.error("Error loading library categories:", err));
  }, [API_BASE]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a book title");
      return;
    }
    if (!selectedCat) {
      toast.error("Please select a library category");
      return;
    }

    const data = {
      title: title.trim(),
      price: Number(price || 0),
      page: Number(page || 0),
      description: description,
      courseCategory: [selectedCat],
      image1,
      fileLink,
    };

    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE}/book/${itemId}`, data);
      if (res.status === 200 || res.status === 201) {
        toast.success("Book updated successfully!");
        if (refreshBooks) refreshBooks();
        handleClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5";

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          Update Book Details
        </h2>
        <p className="text-slate-500 text-xs mt-1">Modify inventory properties, pricing, and visual covers.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        
        {/* Title */}
        <div>
          <label className={labelStyles}>Book Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Book Title"
            className={inputStyles}
          />
        </div>

        {/* Pricing & Metadata grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyles}>Price (৳) *</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Price"
              className={inputStyles}
            />
          </div>

          <div>
            <label className={labelStyles}>Page Count</label>
            <input
              value={page}
              onChange={(e) => setPage(e.target.value)}
              type="number"
              placeholder="Page Count"
              className={inputStyles}
            />
          </div>
        </div>

        {/* Category custom dropdown */}
        <div>
          <label className={labelStyles}>Library Category *</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all flex items-center justify-between cursor-pointer"
            >
              <span className={selectedCat ? "text-slate-800 font-semibold" : "text-slate-400"}>
                {selectedCat || "Select category"}
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute z-40 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden py-1.5 max-h-60 overflow-y-auto animate-in fade-in duration-200">
                  {categoryList.length > 0 ? (
                    categoryList.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedCat(option.category);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between ${
                          selectedCat === option.category ? "bg-slate-50/80 text-emerald-600 font-bold" : "text-slate-700"
                        }`}
                      >
                        <span>{option.category}</span>
                        {selectedCat === option.category && (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-2">No categories defined yet</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description Rich Text Editor */}
        <div>
          <label className={labelStyles}>Book Description</label>
          <JoditEditor
            value={description}
            onBlur={(newContent) => setDescription(newContent)}
          />
        </div>

        {/* File upload images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" />
              Main Cover Image
            </span>
            <CommonFileUpload setUrl={setImage1} url={image1} />
          </div>

          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              Download Attachment (e.g. PDF link)
            </span>
            <input
              type="text"
              placeholder="Direct URL link"
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>

      </div>

      {/* Action triggers */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
        <button
          onClick={handleClose}
          disabled={loading}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all cursor-pointer text-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98] disabled:opacity-50 cursor-pointer text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Sparkles className="w-4.5 h-4.5" />
              Save Changes
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default UpdateLibrary;

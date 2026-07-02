"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import dynamic from "next/dynamic";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";
import { 
  BookOpen, ChevronDown, Check, Loader2, Sparkles, 
  Trash2, UserPlus, Image as ImageIcon, FileText, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddBook = () => {
  const { register, handleSubmit, reset } = useForm();
  const [description, setDescription] = useState("");
  const [bookImages, setBookImages] = useState(["", "", ""]);
  const [fileLink, setFileLink] = useState("");
  const [authors, setAuthors] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    fetch(`${API_BASE}/category`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length > 0) setCategories(data.data[0].library || []);
      })
      .catch(err => console.error("Category fetch error:", err));
  }, [API_BASE]);

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const addAuthorField = () => {
    setAuthors([...authors, ""]);
  };

  const removeAuthorField = (index) => {
    if (authors.length === 1) {
      setAuthors([""]);
      return;
    }
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData) => {
    if (!formData.title.trim()) {
      toast.error("Please enter a book title");
      return;
    }
    if (!selectedCat) {
      toast.error("Please select a book category");
      return;
    }

    const filteredAuthors = authors.filter((name) => name.trim() !== "");
    if (filteredAuthors.length === 0) {
      toast.error("Please add at least one author");
      return;
    }

    const finalData = {
      ...formData,
      price: Number(formData.price || 0),
      salePrice: Number(formData.salePrice || 0),
      page: Number(formData.page || 0),
      description: description,
      courseCategory: [selectedCat],
      author: filteredAuthors.map((name) => ({
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

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/book`, finalData);
      toast.success("Book added successfully!");
      reset();
      setDescription("");
      setAuthors([""]);
      setBookImages(["", "", ""]);
      setFileLink("");
      setSelectedCat("");
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm";
  const labelStyles = "text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* ── Breadcrumb & Back action ── */}
      <Link 
        href="/dashboard/admin/library"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          Add New Book
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Publish a new textbook, guide, or downloadable resource to the digital library catalog.
        </p>
      </div>

      {/* ── Form Container ── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* SECTION 1: Book Info */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-800 pb-2.5 border-b border-slate-50 uppercase tracking-wider">Book Information</h3>
          
          <div>
            <label className={labelStyles}>Book Title *</label>
            <input 
              {...register("title", { required: true })} 
              placeholder="e.g. নূরানী কায়দা সহজ শিক্ষা" 
              className={inputStyles} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelStyles}>Regular Price (৳) *</label>
              <input 
                {...register("price", { required: true })} 
                type="number" 
                placeholder="e.g. 250" 
                className={inputStyles} 
              />
            </div>
            
            <div>
              <label className={labelStyles}>Sale Price (৳)</label>
              <input 
                {...register("salePrice")} 
                type="number" 
                placeholder="e.g. 199 (optional)" 
                className={inputStyles} 
              />
            </div>

            <div>
              <label className={labelStyles}>Page Count</label>
              <input 
                {...register("page")} 
                type="number" 
                placeholder="e.g. 64" 
                className={inputStyles} 
              />
            </div>

            <div>
              <label className={labelStyles}>Format / Type</label>
              <input 
                {...register("format")} 
                placeholder="e.g. PDF, Hardcover, ePUB" 
                className={inputStyles} 
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Authors & Classification */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-800 pb-2.5 border-b border-slate-50 uppercase tracking-wider">Authors & Category</h3>
          
          {/* Custom category select dropdown */}
          <div>
            <label className={labelStyles}>Library Category Location *</label>
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
                    {categories.length > 0 ? (
                      categories.map((option) => (
                        <button
                          key={option._id}
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
                      <p className="text-xs text-slate-400 text-center py-2">No library categories defined yet</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dynamic Authors input fields */}
          <div>
            <label className={labelStyles}>Authors *</label>
            <div className="space-y-2.5">
              {authors.map((auth, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      value={auth} 
                      onChange={(e) => handleAuthorChange(index, e.target.value)} 
                      placeholder={`Author #${index + 1} Name`}
                      className={inputStyles} 
                      required
                    />
                  </div>
                  {authors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAuthorField(index)}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer shrink-0 border border-rose-100"
                      title="Remove author"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={addAuthorField} 
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              + Add Another Author
            </button>
          </div>
        </div>

        {/* SECTION 3: Book Description */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-800 pb-2.5 border-b border-slate-50 uppercase tracking-wider">Book Description</h3>
          <div>
            <JoditEditor 
              value={description} 
              onBlur={(newContent) => setDescription(newContent)}
            />
          </div>
        </div>

        {/* SECTION 4: Cover & Downloadable Uploads */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-800 pb-2.5 border-b border-slate-50 uppercase tracking-wider">Cover Images & Attachments</h3>
          
          {/* Image Upload list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Cover Image {i+1}
                </span>
                
                <CommonFileUpload setUrl={(url) => {
                  const newImgs = [...bookImages];
                  newImgs[i] = url;
                  setBookImages(newImgs);
                }} url={bookImages[i]} />
              </div>
            ))}
          </div>

          {/* Digital File attachment */}
          <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              Digital Book Attachment (e.g. PDF link)
            </span>
            <input
              type="text"
              placeholder="Paste direct download URL here"
              value={fileLink}
              onChange={(e) => setFileLink(e.target.value)}
              className={inputStyles}
            />
          </div>
        </div>

        {/* ── Submit Action Button ── */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/15 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving book...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 shrink-0" />
                Publish Book
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AddBook;
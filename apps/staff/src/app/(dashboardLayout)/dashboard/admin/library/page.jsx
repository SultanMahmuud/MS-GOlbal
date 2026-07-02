'use client';

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { TbCurrencyTaka } from 'react-icons/tb';
import UpdateLibrary from '@/components/AdminDashboard/AddLibrary/UpdateLibrary';
import { 
  BookOpen, Plus, Search, Trash2, Edit3, Layers, 
  FileText, Coins, BarChart3, AlertCircle, X
} from 'lucide-react';
import { toast } from 'sonner';

const getCategoryBadgeStyles = (categoryName) => {
  const styles = [
    { bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { bg: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    { bg: "bg-amber-50 text-amber-700 border-amber-100" },
    { bg: "bg-sky-50 text-sky-700 border-sky-100" },
    { bg: "bg-rose-50 text-rose-700 border-rose-100" },
  ];
  if (!categoryName) return styles[0];
  const hash = String(categoryName).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return styles[hash % styles.length];
};

const AdminLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState('');
  const [singleBook, setSingleBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  // Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/book`);
      setBooks(res?.data?.data || []);
    } catch (error) {
      toast.error('Failed to load books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a book
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book from the catalog?')) return;
    try {
      await axios.delete(`${API_BASE}/book/delete/${id}`);
      toast.success('Book deleted successfully');
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      toast.error('Failed to delete book');
      console.error(error);
    }
  };

  // Open update modal and fetch single book details
  const handleClickOpen = async (id) => {
    setItemId(id);
    try {
      const res = await axios.get(`${API_BASE}/book/${id}`);
      setSingleBook(res?.data);
      setOpen(true);
    } catch (error) {
      toast.error('Failed to load book details');
      console.error(error);
    }
  };

  const handleClose = () => {
    setItemId('');
    setSingleBook(null);
    setOpen(false);
  };

  // Search filtering
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const q = searchQuery.toLowerCase();
    return books.filter((b) =>
      b.title?.toLowerCase().includes(q) ||
      (b.author && b.author.some(a => a?.name?.toLowerCase().includes(q))) ||
      (b.courseCategory && b.courseCategory.some(c => c?.toLowerCase().includes(q)))
    );
  }, [books, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = books.length;
    const uniqueCats = new Set(books.flatMap(b => b.courseCategory || [])).size;
    const totalVal = books.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const digitalFormats = books.filter(b => b.format?.toLowerCase() === 'pdf' || b.format?.toLowerCase() === 'epub' || b.fileLink).length;
    return { total, uniqueCats, totalVal, digitalFormats };
  }, [books]);

  return (
    <div className="px-4 py-6 space-y-6 max-w-7xl mx-auto">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            Book Catalog
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage library inventory, authors, pricing, and downloadable materials.
          </p>
        </div>
        <Link
          href="/dashboard/admin/library/add-book"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/10 active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Book
        </Link>
      </div>

      {/* ── Stats Dashboard ── */}
      {!loading && books.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Books</span>
              <p className="text-xl font-black text-slate-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categories</span>
              <p className="text-xl font-black text-slate-800">{stats.uniqueCats}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalog Value</span>
              <div className="flex items-center text-xl font-black text-slate-800">
                <TbCurrencyTaka className="text-lg -ml-0.5 shrink-0" />
                <span>{stats.totalVal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-Books / PDFs</span>
              <p className="text-xl font-black text-slate-800">{stats.digitalFormats}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Search Bar ── */}
      {!loading && books.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search book title, author, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all shadow-sm"
          />
        </div>
      )}

      {/* ── Catalog Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white border rounded-2xl p-4 animate-pulse space-y-4">
              <div className="w-full h-72 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No books in library</h3>
          <p className="text-slate-400 text-sm mb-6">Build your inventory by publishing your first academic book.</p>
          <Link
            href="/dashboard/admin/library/add-book"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add First Book
          </Link>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-600">No matching books</h3>
          <p className="text-slate-400 text-xs">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((item) => {
            const hasSalePrice = item.salePrice && item.salePrice < item.price;
            const categoryName = item.courseCategory?.[0] || "";
            const catBadge = getCategoryBadgeStyles(categoryName);
            
            return (
              <div
                key={item._id}
                className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                {/* Format tag badge */}
                {item.format && (
                  <span className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                    {item.format}
                  </span>
                )}

                {/* Book Cover */}
                <div className="relative w-full h-72 rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-100/50 shadow-sm shrink-0">
                  <Image
                    src={item.image1 || '/placeholder.png'}
                    alt={item.title}
                    fill
                    sizes="(max-w-768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={false}
                  />
                </div>

                {/* Categories */}
                {categoryName && (
                  <span className={`inline-flex self-start px-2 py-0.5 rounded-lg text-[9px] font-extrabold border mb-2 ${catBadge.bg}`}>
                    {categoryName}
                  </span>
                )}

                {/* Info block */}
                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="font-extrabold text-slate-800 text-[15px] truncate group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">
                    {item.author && item.author.length > 0
                      ? item.author.map((a) => a.name).join(', ')
                      : 'Unknown Author'}
                  </p>
                </div>

                {/* Pricing Block */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-50 shrink-0">
                  <div className="flex items-center text-emerald-600">
                    <TbCurrencyTaka className="text-lg -mr-0.5" />
                    <span className="text-base font-black">
                      {hasSalePrice ? item.salePrice : item.price}
                    </span>
                  </div>
                  {hasSalePrice && (
                    <div className="flex items-center text-slate-300 line-through text-[11px] font-bold">
                      <TbCurrencyTaka className="text-sm -mr-0.5" />
                      <span>{item.price}</span>
                    </div>
                  )}
                </div>

                {/* Hover actions menu */}
                <div className="flex gap-2 mt-4 pt-1 shrink-0">
                  <button
                    onClick={() => handleClickOpen(item._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer text-xs font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="inline-flex items-center justify-center p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                    title="Delete Book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ── Update Dialog Overlay Drawer ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={handleClose} />
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-700 border border-slate-100 hover:scale-105 transition-all z-20 cursor-pointer"
              onClick={handleClose}
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="overflow-y-auto p-1">
              <UpdateLibrary
                itemId={itemId}
                handleClose={handleClose}
                singleBook={singleBook}
                refreshBooks={fetchBooks}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLibrary;

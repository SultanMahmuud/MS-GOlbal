'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { TbCurrencyTaka } from 'react-icons/tb';
import UpdateLibrary from '@/components/AdminDashboard/AddLibrary/UpdateLibrary';

const AdminLibrary = () => {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState('');
  const [singleBook, setSingleBook] = useState(null);

  // Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book`);
      setBooks(res?.data?.data || []);
    
    } catch (error) {
      alert('Failed to load books');
      console.error(error);
    }
  };

  // Delete a book
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book/delete/${id}`);
      alert('Book deleted successfully');
      setBooks((prev) => prev.filter((book) => book._id !== id));
    } catch (error) {
      alert('Failed to delete book');
      console.error(error);
    }
  };

  // Open update modal and fetch single book details
  const handleClickOpen = async (id) => {
    setItemId(id);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book/${id}`);
      setSingleBook(res?.data);
      setOpen(true);
    } catch (error) {
      alert('Failed to load book details');
      console.error(error);
    }
  };

  const handleClose = () => {
    setItemId('');
    setSingleBook(null);
    setOpen(false);
  };

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 font-[Hind]">
        একাডেমিক বইসমূহ
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {books.length > 0 ? (
          books.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded shadow p-4 flex flex-col items-center"
            >
              <Image
                src={item.image1 || '/placeholder.png'}
                alt={item.title}
                width={192}
                height={288}
                className="w-48 h-72 object-cover mb-4 rounded"
              />

              <h3 className="text-lg font-medium text-blue-700 text-left w-full">
                {item.title}
              </h3>

              <p className="text-sm text-gray-600 text-left w-full">
                {item.author && item.author.length > 0
                  ? item.author.map((a) => a.name).join(', ')
                  : 'Unknown Author'}
              </p>

              <div className="flex items-center text-green-600 w-full mt-1">
                <TbCurrencyTaka className="text-lg" />
                <span className="text-base font-semibold">{item.price}</span>
              </div>

              <div className="flex justify-between gap-2 mt-4 w-full">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleClickOpen(item._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No books available
          </p>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={handleClose}
            >
              ✕
            </button>
            <UpdateLibrary
              itemId={itemId}
              handleClose={handleClose}
              singleBook={singleBook}
              refreshBooks={fetchBooks}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLibrary;

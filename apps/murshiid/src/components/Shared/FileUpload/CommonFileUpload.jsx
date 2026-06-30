"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const CommonFileUpload = ({ setUrl, url, label }) => {
 
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile,'selected file')
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/images`, formData);
      console.log(res,'response image')
      setUrl(res.data?.url); // <-- replace the URL with new one
      alert('Upload successful!');
    } catch (error) {
      alert('Upload failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-md rounded-md p-4 bg-white w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 w-full">
          {label && (
            <label className="text-sm px-3 py-1 font-semibold rounded-l-md whitespace-nowrap">
              {label}
            </label>
          )}

          <input
            type="file"
            onChange={handleImageChange}
            className="w-full text-sm border rounded-md px-2 py-1 file:border-none file:mr-2 file:bg-primary file:text-white file:px-3 file:py-1"
          />
        </div>

        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          {url && url.length > 4 && (
            <div className="flex items-center gap-2 text-green-600 border border-green-600 rounded-md px-3 py-1 text-sm">
              <FaCloudUploadAlt />
              Uploaded
            </div>
          )}

          {file?.name?.length > 2 && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`text-white text-sm px-3 py-1 rounded-md ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-1">
                  <ImSpinner2 className="animate-spin" />
                  Uploading
                </span>
              ) : (
                'Upload'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonFileUpload;

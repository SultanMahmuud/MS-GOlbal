'use client';

import { FaCheckCircle } from 'react-icons/fa';

const Fileupload = ({ handleSubmit, setFile, loading, url, file }) => {
  const isUploaded = !!url; // true if URL exists and is not empty
  const hasFile = file?.name?.length > 2;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 flex-wrap"
      >
        {!isUploaded && (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm file:mr-2 file:py-1 file:px-3 file:border file:rounded file:bg-white file:text-sm file:cursor-pointer"
          />
        )}

        {!isUploaded ? (
          hasFile && (
            <>
              {loading ? (
                <button
                  type="button"
                  disabled
                  className="flex items-center gap-2 text-white bg-gray-400 cursor-not-allowed px-4 py-1 rounded text-sm shadow"
                >
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Uploading...
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded text-sm shadow hover:bg-blue-700 transition"
                >
                  Upload
                </button>
              )}
            </>
          )
        ) : (
          <span className="inline-flex items-center text-green-600 gap-1 text-sm font-medium">
            <FaCheckCircle className="text-xl" />
            Uploaded
          </span>
        )}
      </form>
    </div>
  );
};

export default Fileupload;

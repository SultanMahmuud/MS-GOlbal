'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DateConversionWithTime } from '@/utils/DateConversionWithTime';


const StudentmonthlyPay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/bkash/monthly`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headers = [
    'Name',
    'Phone Number',
    'Payment Amount',
    'Method',
    'Payment Date'
  ];

  const paginatedData = rowsPerPage > 0
    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : data;

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-4 py-2 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item?.name}</td>
                  <td className="px-4 py-2">{item?.phone}</td>
                  <td className="px-4 py-2">{item?.amount}</td>
                  <td className="px-4 py-2">{item?.method}</td>
                  <td className="px-4 py-2">
                    {DateConversionWithTime(item?.updatedAt?.split('T')[0])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-3 bg-gray-50 border-t border-gray-200 text-sm">
            <div className="flex items-center space-x-2">
              <label htmlFor="rowsPerPage">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                className="border rounded px-2 py-1"
              >
                {[25, 50, 100].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <span>
                {page * rowsPerPage + 1}-
                {Math.min((page + 1) * rowsPerPage, data.length)} of {data.length}
              </span>
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={(page + 1) * rowsPerPage >= data.length}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentmonthlyPay;

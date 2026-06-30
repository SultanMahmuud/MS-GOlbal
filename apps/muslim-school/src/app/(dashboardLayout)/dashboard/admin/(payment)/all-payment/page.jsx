"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";


const AllPayment = () => {
  const [allPayment, setAllPayment] = useState([]);
  const [brandFilter, setBrandFilter] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found");
        }

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...getBrandHeaders(),
          },
        };

        const res = await axios.get(
          `${getApiBaseUrl()}/payment/orders?brandKey=${brandFilter}`,
          config
        );

        const payments = res?.data?.data || [];
        
        setAllPayment(payments.reverse());
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };

    fetchPayments();
  }, [brandFilter]);

  const columns = [
    "Name",
    "Email",
    "Date",
    "Amount",
    "Method",
    "Order ID",
    "Payment Status",
    "Course Name",
    "Brand",
  ];

  const paymentData = allPayment.map(payment => [
    payment?.userId?.name || payment?.email || "",
    payment?.email || "",
    payment?.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "",
    payment?.amount || "",
    payment?.gateway || "",
    payment?.orderId || "",
    payment?.status || "",
    payment?.courseId?.title || "",
    payment?.brandKey || "",
  ]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold">Student Payments</h2>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={brandFilter}
          onChange={(event) => setBrandFilter(event.target.value)}
        >
          <option value="all">All Brands</option>
          <option value="muslim-school">Muslim School</option>
          <option value="quran-care">Quran Care</option>
          <option value="murshiid">Murshiid</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 text-left border-b">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentData.map((row, index) => (
              <tr key={`${row[5]}-${index}`}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2 border-b">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPayment;

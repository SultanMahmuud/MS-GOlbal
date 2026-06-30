"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

import { DateConversionWithTime } from "@/utils/DateConversionWithTime";
import { DataTable } from "@/components/UI/data-table";
import AddLevelModalReg from "@/components/AdminDashboard/AdminCourse/RegistrationModal/AddLevelModalReg";
import { getUserInfo } from "@/services/auth.services";
import { columns } from "@/components/common/newColumn";

const Registration = () => {
  const [registrations, setRegistrations] = useState([]);
  const [openLevel, setOpenLevel] = useState(false);
  const [openDete, setOpenDete] = useState(false);
  const [leveledEmail, setLeveledEmail] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 15;

  // Memoize user to avoid re-creating fetch function
  const user = useMemo(() => getUserInfo(), []);

  // Fetch function
  const fetchRegistrations = useCallback(() => {
    if (!user?.token) return;

    const config = { headers: { authorization: `Bearer ${user.token}` } };

    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registration?limit=${limit}&page=${page}`, config)
      .then((res) => {
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setRegistrations(data);
        
        setTotalPages(res.data?.pagination?.totalPages || 1);
      })
      .catch((err) => console.error(err));
  }, [user, page]); // user is stable now due to useMemo

  // Fetch on mount + modal open/close + page change
  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations, openLevel, openDete]);

  // Prepare table data
  const tableData = useMemo(() => {
    return registrations
      .filter((reg) => reg.regType === "student-registration")
      .map((user) => ({
        id: user._id,
        name: user?.user?.name || "",
        email: user?.user?.email || "",
        number: user?.phoneNumber || "",
        parentName: user?.parentName || "",
        date: DateConversionWithTime(user?.updatedAt?.split?.("T")?.[0] || ""),
        address: user?.address || "",
        level: user?.levels?.level1 || "",
        age: user?.age || "",
        days: user?.attDays || "",
        time: user?.attTime || "",
        interestedSubject: user?.interestedSubject || "",
        openLevel: (email) => {
          setLeveledEmail(email);
          setOpenLevel(true);
        },
        setOpenDete,
      }));
  }, [registrations]);

  console.log(registrations, "registrations");

  return (
    <div className="p-4 w-full">
      <DataTable columns={columns(fetchRegistrations)} data={tableData} />

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4 items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <AddLevelModalReg open={openLevel} setOpen={setOpenLevel} email={leveledEmail} />
    </div>
  );
};

export default Registration;

"use client";

import { useEffect, useState } from "react";
import { DateConversionWithTime } from "@/utils/DateConversionWithTime";
import TeacherModal from "@/components/AdminDashboard/TeacherManagement/TeacherModal";
import ViewDetails from "@/components/AdminDashboard/TeacherManagement/ViewDetails";
import { getTeachers, deleteTeacher, updateTeacher } from "@/services/teacherService";
import { Button } from "@/components/UI/button";
import { Switch } from "@/components/UI/switch";
import { DataTable } from "@/components/UI/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/UI/dialog"; 
import axios from "axios";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]); 
  const [fetchAgain, setFetchAgain] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewTeacher, setViewTeacher] = useState(null); 
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;


  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/role/teacher?limit=${limit}&page=${page}`
      )
      .then((res) => {
        setTeachers(res.data.data || []); // ✅ save only array
        setTotalPages(res.data.pagination?.totalPages || 1);
      })
      .catch((err) => console.error("Error fetching teachers:", err));
  }, [fetchAgain, page]); // ✅ also depend on page

  const handleDelete = async (email) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await deleteTeacher(email);
      setFetchAgain((prev) => !prev); // ✅ refresh data instead of reload
    } catch (err) {
      console.error(err);
      alert("Error deleting teacher");
    }
  };

  const handleToggleBlock = async (teacher) => {
    try {
      await updateTeacher({
        email: teacher.email,
        isBlock: !teacher.isBlock,
      });
      setFetchAgain((prev) => !prev); // ✅ refresh data
    } catch (err) {
      console.error("Failed to update teacher:", err);
      alert("Error updating teacher. Please try again.");
    }
  };

  const columns = [
    {
      accessorKey: "Edit",
      header: "Edit",
      cell: ({ row }) => (
        <Button onClick={() => setSelectedTeacher(row.original)}>Edit</Button>
      ),
    },
    {
      accessorKey: "View",
      header: "View",
      cell: ({ row }) => (
        <Button onClick={() => setViewTeacher(row.original)}>View</Button>
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "number", header: "Number" },
    { accessorKey: "teacherId", header: "ID" },
    { accessorKey: "Department", header: "Department" },
    { accessorKey: "joiningDate", header: "Join" },
    {
      accessorKey: "teacherOfTheMonth",
      header: "Teacher of the Month",
      cell: ({ row }) => (
        <Switch checked={row.original.teacherOfTheMonth} readOnly />
      ),
    },
    {
      accessorKey: "isBlock",
      header: "Block",
      cell: ({ row }) => (
        <Button
          variant={row.original.isBlock ? "destructive" : "outline"}
          onClick={() => handleToggleBlock(row.original)}
        >
          {row.original.isBlock ? "Unblock" : "Block"}
        </Button>
      ),
    },
    {
      accessorKey: "delete",
      header: "Delete",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          onClick={() => handleDelete(row.original.email)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const mappedData = teachers?.map((t) => ({
    ...t,
    joiningDate: DateConversionWithTime(t.joiningDate),
  }));
 const filteredData = mappedData.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="space-y-6">
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-64"
        />
      </div>
      <DataTable columns={columns} data={filteredData} />

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {selectedTeacher && (
        <TeacherModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onUpdated={() => setFetchAgain((prev) => !prev)}
        />
      )}

      {/* View Modal */}
      <Dialog open={!!viewTeacher} onOpenChange={() => setViewTeacher(null)}>
        <DialogContent className="min-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
          </DialogHeader>
          {viewTeacher && <ViewDetails userData={viewTeacher} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherManagement;

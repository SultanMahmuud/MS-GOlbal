"use client";
import { Input } from "@/components/UI/input";
import React, { useEffect, useState } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/current-students`;

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    subject: "",
    date: "",
    location: "",
    time: "",
    classType: "",
    gender: "",
  });
  const [error, setError] = useState("");

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setStudents(data.data || []);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s._id !== id));
      } else {
        alert(data.message || "Failed to delete student");
      }
    } catch (err) {
      alert("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  // Start editing
  const handleEdit = (student) => {
    setEditingId(student._id);
    setEditForm({
      name: student.name,
      subject: student.subject,
      date: student.date,
      location: student.location,
      time: student.time,
      classType: student.classType,
      gender: student.gender,
    });
  };

  // Update student
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s._id === id ? { ...s, ...editForm } : s))
        );
        setEditingId(null);
      } else {
        alert(data.message || "Failed to update student");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Current Students</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {students.map((student) => (
            <li
              key={student._id}
              style={{
                marginBottom: "16px",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              {editingId === student._id ? (
                // Edit Form
                <div className="flex flex-col gap-2">
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Name"
                  />
                  <label htmlFor="subject">Subject</label>
                  <Input
                    id="subject"
                    type="text"
                    value={editForm.subject}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subject: e.target.value })
                    }
                    placeholder="Subject"
                  />
                  <label htmlFor="date">Date</label>
                  <Input
                    id="date"
                    type="text"
                    value={editForm.date}
                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    placeholder="Date"
                  />
                  <label htmlFor="location">Location</label>
                  <Input
                    id="location"
                  
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    placeholder="Location"
                  />
                  <label htmlFor="time">Time</label>
                  <Input
                    id="time"
                    type="text"
                    value={editForm.time}
                    onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    placeholder="Time"
                  />

                  <label htmlFor="gender">Gender</label>
                  <Input
                    id="gender"
                    type="text"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    placeholder="Gender"
                  />

                  <label htmlFor="classType">Class Type</label>
                  <Input
                    id="classType"
                    type="text"
                    value={editForm.classType}
                    onChange={(e) => setEditForm({ ...editForm, classType: e.target.value })}
                    placeholder="classType"
                  />


                  <button
                    onClick={() => handleUpdate(student._id)}
                    style={{
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      marginRight: "8px",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      backgroundColor: "#999",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // Display Mode
                <>
                  <p>
                    <strong>Name:</strong> {student.name}
                  </p>
                  <p>
                    <strong>Subject:</strong> {student.subject}
                  </p>
                  <p>
                    <strong>Date:</strong> {student.date}
                  </p>
                  <p>
                    <strong>Location:</strong> {student.location}
                  </p>
                  <p>
                    <strong>Time:</strong> {student.time}
                  </p>
                  <p>
                    <strong>Gender:</strong> {student.gender}
                  </p>
                  <p>
                    <strong>Class Type:</strong> {student.classType}
                  </p>
                  <button
                    onClick={() => handleEdit(student)}
                    style={{
                      backgroundColor: "#1890ff",
                      color: "#fff",
                      marginRight: "8px",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    disabled={deletingId === student._id}
                    style={{
                      backgroundColor: "#ff4d4f",
                      color: "#fff",
                      padding: "6px 12px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    {deletingId === student._id ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageStudents;

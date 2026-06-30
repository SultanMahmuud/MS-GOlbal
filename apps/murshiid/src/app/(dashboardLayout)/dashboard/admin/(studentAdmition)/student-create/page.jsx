'use client'

import React, { useState } from "react";
import { useForm } from "react-hook-form";


const RegisterStudent = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            role: "student",
            password: data.password || "student",
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        reset(); // clear form
      } else {
        setMessage({
          type: "error",
          text: result.error || "Submission failed",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error or server issue" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ margin: "auto", marginTop: "20px", padding: "12px" }}
      className="mt-12 bg-gray-50 p-28"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Name */}
          <div style={{ marginBottom: "12px" }}>
            <label>Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}
          </div>

          {/* Email and Password */}

          <div style={{ marginBottom: "12px" }}>
            <label>Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}

          <div style={{ marginBottom: "12px" }}>
            <label>Phone Number</label>
            <input
              {...register("number", { required: "Phone Number is required" })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.number && (
              <p style={{ color: "red" }}>{errors.number.message}</p>
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: "12px" }}>
            <label>Location</label>
            <input
              {...register("location", { required: "Location is required" })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.location && (
              <p style={{ color: "red" }}>{errors.location.message}</p>
            )}
          </div>

          {/* Age */}
          <div style={{ marginBottom: "12px" }}>
            <label>Age</label>
            <input
              {...register("age", { required: "Age is required" })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.age && <p style={{ color: "red" }}>{errors.age.message}</p>}
          </div>

          {/* Guardian Information */}
          <div style={{ marginBottom: "12px" }}>
            <label>Guardian Name</label>
            <input
              {...register("guardianName", {
                required: "Guardian Name is required",
              })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.guardianName && (
              <p style={{ color: "red" }}>{errors.guardianName.message}</p>
            )}
          </div>

          {/* Institution Information */}
          <div style={{ marginBottom: "12px" }}>
            <label>Institution Name</label>
            <input
              {...register("institutionName", {
                required: "Institution Name is required",
              })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.institutionName && (
              <p style={{ color: "red" }}>{errors.institutionName.message}</p>
            )}
          </div>

          {/* Password */}
          {/* add a show hide eye here */}

          <div style={{ position: "relative" }}>
            <label>Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "60%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}

          {/* Class Type */}
          <div style={{ marginBottom: "12px" }}>
            <label>Days per week</label>
            <input
              {...register("classType", {
                required: "Days per week is required",
              })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.classType && (
              <p style={{ color: "red" }}>{errors.classType.message}</p>
            )}
          </div>
          {/* Subject */}
          <div style={{ marginBottom: "12px" }}>
            <label>Subject</label>
            <input
              {...register("subject", { required: "Subject is required" })}
              type="text"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.subject && (
              <p style={{ color: "red" }}>{errors.subject.message}</p>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px 20px", backgroundColor: 'green' }}
          className="rounded-md w-1/2 mt-9 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: 20,
            color: message.type === "success" ? 'green': "red",
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default RegisterStudent;

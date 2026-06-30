"use client";

import React from "react";
import { Button } from "@/components/UI/button";

const FileDownload = ({ url, label }) => {
  if (!url) return null;

  return (
    <div className="flex items-center gap-3">
      <p className="font-medium">{label}:</p>
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Download
      </a>
    </div>
  );
};

const ViewDetails = ({ userData }) => {
  if (!userData) {
    return <p className="text-red-500">No data available</p>;
  }

  return (
    <div className="bg-white dark:bg-gray-900  space-y-8">
      {/* Personal Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <p><span className="font-medium">Name:</span> {userData.name}</p>
          <p><span className="font-medium">Father's Name:</span> {userData.fatherName}</p>
          <p><span className="font-medium">Email:</span> {userData.email}</p>
          <p><span className="font-medium">Phone:</span> {userData.number}</p>
          <p><span className="font-medium">Date of Birth:</span> {userData.dob}</p>
          <p><span className="font-medium">Nationality:</span> {userData.nationality}</p>
          <p><span className="font-medium">Marital Status:</span> {userData.married}</p>
          <p><span className="font-medium">Gender:</span> {userData.gender}</p>
        </div>
        <p className="mt-2"><span className="font-medium">Bio:</span> {userData.bio}</p>
      </section>

      {/* Files */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
        <div className="space-y-2">
          <FileDownload url={userData.birthCertificate} label="Birth Certificate" />
          <FileDownload url={userData.avatar} label="Profile Image" />
          <FileDownload url={userData.NID} label="National ID" />
          <FileDownload url={userData.passport} label="Passport" />
        </div>
      </section>

      {/* Permanent Address */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Permanent Address</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <p><span className="font-medium">Country:</span> {userData.perCountry}</p>
          <p><span className="font-medium">District:</span> {userData.perDistrict}</p>
          <p><span className="font-medium">Thana:</span> {userData.perThana}</p>
          <p><span className="font-medium">Post Code:</span> {userData.perPostCode}</p>
        </div>
        <p><span className="font-medium">Permanent Address:</span> {userData.perAddressLine}</p>
        <p><span className="font-medium">Current Address:</span> {userData.currAddressLine}</p>
      </section>

      {/* Qualifications */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <p><span className="font-medium">Qualification 1:</span> {userData.qual2}</p>
          <p><span className="font-medium">Qualification 2:</span> {userData.qual3}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <p><span className="font-medium">Department:</span> {userData.Department}</p>
          <p><span className="font-medium">Total Students:</span> {userData.totalStudents}</p>
          <p><span className="font-medium">Experience:</span> {userData.experience}</p>
          <p><span className="font-medium">Institution:</span> {userData.institution}</p>
          <p><span className="font-medium">Expert:</span> {userData.expert}</p>
          <p><span className="font-medium">Total Classes:</span> {userData.totalClasses}</p>
        </div>
      </section>

      {/* Join Date */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Join Date</h2>
        <p>{userData.joiningDate}</p>
      </section>

      {/* Payment Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <p><span className="font-medium">MFS Number:</span> {userData.mfsNumber}</p>
        <p><span className="font-medium">MFS Medium:</span> {userData.mfsMedium}</p>
      </section>

      {/* Bank Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <p><span className="font-medium">Bank Name:</span> {userData.bankName}</p>
          <p><span className="font-medium">Account Name:</span> {userData.bankAccountName}</p>
          <p><span className="font-medium">Account Number:</span> {userData.bankAccountNum}</p>
          <p><span className="font-medium">Branch:</span> {userData.branchName}</p>
          <p><span className="font-medium">Routing Number:</span> {userData.routingName}</p>
        </div>
      </section>

     
    </div>
  );
};

export default ViewDetails;

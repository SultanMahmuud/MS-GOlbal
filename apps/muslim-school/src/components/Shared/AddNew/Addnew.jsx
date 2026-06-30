"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/UI/input";
import CommonFileUpload from "../FileUpload/CommonFileUpload";
import { useCreateResourceMutation } from "@/redux/api/curd";
import { authRoutes } from "@/constants/end-point";
import { tagTypes } from "@/redux/tag-types";
import { toast } from "sonner";

const AddNew = ({ role }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [married, setMarried] = useState("Married");
  const [gender, setGender] = useState("Male");
  const [mfsMedium, setMfsMedium] = useState("Bkash");
  const [birthCertificate, setBirthCertificate] = useState("");
  const [NID, setNid] = useState("");
  const [passport, setPassport] = useState("");
  const [avatar, setAvatar] = useState("");

  const [registerUser, { isLoading }] = useCreateResourceMutation();

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        married,
        gender,
        mfsMedium,
        role,
        NID,
        birthCertificate,
        passport,
        avatar,
      };

      const res = await registerUser({
        url: authRoutes.registerTeacher,
        tags: tagTypes.auth,
        payload,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Registration successful!");
      } else {
        toast.error(res.message || "Give unique email or phone");
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Registration failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md"
    >
      <section>
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Name</label>
            <Input {...register("name")} placeholder="Name" />
          </div>
          <div>
            <label className="block mb-1">Father's Name</label>
            <Input {...register("fatherName")} placeholder="Father's Name" />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <Input {...register("email")} placeholder="Email" required />
          </div>
          <div>
            <label className="block mb-1">Phone Number</label>
            <Input {...register("number")} placeholder="Phone Number" />
          </div>
          <div>
            <label className="block mb-1">Date of Birth</label>
            <Input type="date" {...register("dob")} className="Input" />
          </div>
          <div>
            <label className="block mb-1">Nationality</label>
            <Input {...register("nationality")} placeholder="Nationality" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1">Marital Status</label>
            <select
              value={married}
              onChange={(e) => setMarried(e.target.value)}
              className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
            >
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <CommonFileUpload setUrl={setBirthCertificate} url={birthCertificate} label="Birth Certificate" />
          <CommonFileUpload setUrl={setAvatar} url={avatar} label="Profile Image" />
          <CommonFileUpload setUrl={setNid} url={NID} label="National ID" />
          <CommonFileUpload setUrl={setPassport} url={passport} label="Passport" />
        </div>

        <div className="mt-4">
          <label className="block mb-1">Bio</label>
          <textarea
            {...register("bio")}
            rows="4"
            placeholder="Bio"
            className="w-full border p-2 rounded-md dark:bg-gray-800 dark:text-white"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Permanent Address</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Country</label>
            <Input {...register("perCountry")} placeholder="Country" />
          </div>
          <div>
            <label className="block mb-1">District</label>
            <Input {...register("perDistrict")} placeholder="District" />
          </div>
          <div>
            <label className="block mb-1">Thana</label>
            <Input {...register("perThana")} placeholder="Thana" />
          </div>
          <div>
            <label className="block mb-1">Post Code</label>
            <Input {...register("perPostCode")} placeholder="Post Code" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block mb-1">Permanent Address Line</label>
          <Input {...register("perAddressLine")} placeholder="Permanent Address Line" />
        </div>
        <div className="mt-4">
          <label className="block mb-1">Current Address Line</label>
          <Input {...register("currAddressLine")} placeholder="Current Address Line" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Qualification 1</label>
            <Input {...register("qual2")} placeholder="Qualification 1" />
          </div>
          <div>
            <label className="block mb-1">Qualification 2</label>
            <Input {...register("qual3")} placeholder="Qualification 2" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block mb-1">Department</label>
            <Input {...register("Department")} placeholder="Department" />
          </div>
          <div>
            <label className="block mb-1">Total Students</label>
            <Input {...register("totalStudents")} placeholder="Total Students" />
          </div>
          <div>
            <label className="block mb-1">Experience</label>
            <Input {...register("experience")} placeholder="Experience" />
          </div>
          <div>
            <label className="block mb-1">Institution</label>
            <Input {...register("institution")} placeholder="Institution" />
          </div>
          <div>
            <label className="block mb-1">Expert</label>
            <Input {...register("expert")} placeholder="Expert" />
          </div>
          <div>
            <label className="block mb-1">Total Classes</label>
            <Input {...register("totalClasses")} placeholder="Total Classes" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Join Date</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Joining Date</label>
            <Input type="date" {...register("joiningDate")} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">MFS Number</label>
            <Input {...register("mfsNumber")} placeholder="MFS Number" />
          </div>
          <div>
            <label className="block mb-1">MFS Medium</label>
            <select
              value={mfsMedium}
              onChange={(e) => setMfsMedium(e.target.value)}
              className="border p-2 rounded-md dark:bg-gray-800 dark:text-white"
            >
              <option value="Bkash">Bkash</option>
              <option value="Nagad">Nagad</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Bank Name</label>
            <Input {...register("bankName")} placeholder="Bank Name" />
          </div>
          <div>
            <label className="block mb-1">Account Name</label>
            <Input {...register("bankAccountName")} placeholder="Account Name" />
          </div>
          <div>
            <label className="block mb-1">Account Number</label>
            <Input {...register("bankAccountNum")} placeholder="Account Number" />
          </div>
          <div>
            <label className="block mb-1">Branch Name</label>
            <Input {...register("branchName")} placeholder="Branch Name" />
          </div>
          <div>
            <label className="block mb-1">Routing Number</label>
            <Input {...register("routingName")} placeholder="Routing Number" />
          </div>
        </div>
      </section>

      {errors.exampleRequired && (
        <p className="text-red-500">This field is required</p>
      )}

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="bg-primary text-white font-semibold px-6 py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddNew;

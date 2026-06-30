"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";

import { updateTeacher } from "@/services/teacherService";
import { toast } from "sonner";
import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";

const TeacherUpdateModal = ({ teacher, onClose, onUpdated }) => {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      reset(teacher);
      setMarried(teacher.married || "Married");
      setGender(teacher.gender || "Male");
      setMfsMedium(teacher.mfsMedium || "Bkash");
      setBirthCertificate(teacher.birthCertificate || "");
      setNid(teacher.NID || "");
      setPassport(teacher.passport || "");
      setAvatar(teacher.avatar || "");
    }
  }, [teacher, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...teacher,
        ...data,
        married,
        gender,
        mfsMedium,
        birthCertificate,
        NID,
        passport,
        avatar,
      };

      await updateTeacher(payload);
      toast.success("Teacher updated successfully!");
      onUpdated(payload);
      onClose();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  });

  return (
    <Dialog open={!!teacher} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Teacher</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Personal Information</h2>
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
                <Input {...register("email")} placeholder="Email" disabled />
              </div>
              <div>
                <label className="block mb-1">Phone Number</label>
                <Input {...register("number")} placeholder="Phone Number" />
              </div>
              <div>
                <label className="block mb-1">Phone Number</label>
                <Input {...register("number")} placeholder="Phone Number" />
              </div>
              <div>
                <label className="block mb-1">Teacher ID</label>
                <Input {...register("teacherId")} placeholder="Teacher ID" />
              </div>
              <div>
                <label className="block mb-1">Date of Birth</label>
                <Input type="date" {...register("dob")} />
              </div>
              <div>
                <label className="block mb-1">Nationality</label>
                <Input {...register("nationality")} placeholder="Nationality" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block mb-1">Marital Status</label>
                <select
                  value={married}
                  onChange={(e) => setMarried(e.target.value)}
                  className="border p-2 rounded-md"
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
                  className="border p-2 rounded-md"
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

            <div>
              <label className="block mb-1">Bio</label>
              <textarea
                {...register("bio")}
                rows="4"
                placeholder="Bio"
                className="mt-1 w-full border p-2 rounded-md"
              />
            </div>
          </section>

          {/* Permanent Address */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Permanent Address</h2>
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
            <div>
              <label className="block mb-1">Permanent Address Line</label>
              <Input {...register("perAddressLine")} placeholder="Permanent Address Line" className="mt-1" />
            </div>
            <div>
              <label className="block mb-1">Current Address Line</label>
              <Input {...register("currAddressLine")} placeholder="Current Address Line" className="mt-1" />
            </div>
          </section>

          {/* Qualifications */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Qualifications</h2>
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

          {/* Join date */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Join Date</h2>
            <label className="block mb-1">Joining Date</label>
            <Input type="date" {...register("joiningDate")} />
          </section>

          {/* Payment Information */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Payment Information</h2>
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
                  className="border p-2 rounded-md"
                >
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                </select>
              </div>
            </div>
          </section>

          {/* Bank Information */}
          <section>
            <h2 className="text-lg font-semibold mb-3">Bank Information</h2>
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

          <DialogFooter className="flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherUpdateModal;

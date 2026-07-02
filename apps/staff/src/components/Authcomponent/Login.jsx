'use client';
import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { Button } from "@/components/UI/button";
import { cn } from "@/lib/utils";
import { useCreateResourceMutation } from "@/redux/api/curd";
import { setAuth } from "@/redux/features/slice/authSlice";
import { authRoutes } from "@/constants/end-point";
import { tagTypes } from "@/redux/tag-types";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getAppKind, getBrandKey, getDashboardPath } from "@/lib/brand-config";

const Login = ({ expectedRole, redirectPath }) => {
  const dispatch = useDispatch();
const router = useRouter();


  const [inputValue, setInputValue] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showInitialSection, setShowInitialSection] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();



  const [loginUser, { isLoading }] = useCreateResourceMutation();
  const [loading, setLoading] = useState(false);
  const onSubmitPass = async (data) => {
try {
    if (loading) return;
    setLoading(true);

    if (!data.password || data.password.trim().length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    if (!email && !number) {
      toast.error("Please provide email or phone number!");
      return;
    }

    const response = await loginUser({
      url: authRoutes.login,
      tags: tagTypes.auth,
      payload: {
        email: email || undefined,
        password: data.password.trim(),
        number: number || undefined,
        expectedRole,
        appKind: getAppKind(),
        brandKey: getBrandKey(),
      },
    }).unwrap();
  
    if (!response.success) {
      toast.error( response.error || "Login failed! Please try again.");
      return;
    }

    dispatch(
      setAuth({
        token: response?.token,
        _id: response?._id,
        name: response?.name,
        email: response?.email,
        number: response?.number,
        role: response?.role,
        brandKey: response?.brandKey,
        assignedBrandKeys: response?.assignedBrandKeys,
        isBlock: response?.isBlock,
      })
    );

    if (typeof window !== "undefined" && response?.token) {
      const userPayload = {
        token: response.token,
        _id: response?._id,
        name: response?.name,
        email: response?.email,
        number: response?.number,
        role: response?.role,
        brandKey: response?.brandKey,
        assignedBrandKeys: response?.assignedBrandKeys,
        isBlock: response?.isBlock,
      };
      window.localStorage.setItem("token", response.token);
      window.localStorage.setItem("user", JSON.stringify(userPayload));
    }

    toast.success("Login successful!");
    router.push(redirectPath || getDashboardPath(response?.role));
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error?.error || "Failed to login! Please try again.");
  } finally {
    setLoading(false);
  }

  };

  const handleLogin = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return setSnackbarMessage("ফোন নম্বর বা ইমেইল দিন");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;

    if (emailRegex.test(trimmedInput)) {
      setEmail(trimmedInput.toLowerCase());
      setNumber("");
    } else if (phoneRegex.test(trimmedInput)) {
      setNumber(trimmedInput);
      setEmail("");
    } else {
      return setSnackbarMessage("ভ্যালিড ফোন নম্বর বা ইমেইল দিন");
    }

    setSnackbarMessage("");
    setShowInitialSection(false);
    setShowPassword(true);
  };

  const handleChangeNumberEmail = () => {
    setShowInitialSection(true);
    setShowPassword(false);
    setInputValue("");
    setEmail("");
    setNumber("");
  };

  return (
    <div className="flex flex-col">
      <div className="">
        {showInitialSection && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-left pt-4">মোবাইল নাম্বার বা ইমেইল দিন</p>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium"
              placeholder="মোবাইল নাম্বার বা ইমেইল দিন"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button onClick={handleLogin} className="w-full">
              এগিয়ে যাই
            </Button>
            {snackbarMessage && (
              <p className="text-sm text-red-500 mt-2">{snackbarMessage}</p>
            )}
          </div>
        )}

        {showPassword && (
          <form
            className="space-y-3"
            onSubmit={handleSubmit(onSubmitPass)}
          >
            <input
              type="password"
              className={cn(
                "w-full border border-gray-300 rounded-md px-3 py-2 text-sm mt-3",
                errors.password && "border-red-500"
              )}
              placeholder="পাসওয়ার্ড দিন"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">Password is required</p>
            )}
            <Button type="submit" className="w-full">
              এগিয়ে যাই
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleChangeNumberEmail}
            >
              নাম্বার/ ইমেইল পরিবর্তন
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

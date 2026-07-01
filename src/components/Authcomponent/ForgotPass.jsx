'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/UI/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { useUpdatePutResourceMutation } from '@/redux/api/curd';
import { authRoutes } from '@/constants/end-point';
import { tagTypes } from '@/redux/tag-types';

import { toast } from 'sonner';

const ForgotPass = ({ onBackToLogin }) => {
 

  const [showStep1, setShowStep1] = useState(true);
  const [showStep2, setShowStep2] = useState(false);
  const [showStep3, setShowStep3] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [loginMethod, setLoginMethod] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);


  const showToast = (msg) => {
    setMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
 
  } = useForm();

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const value = inputValue.trim();
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\d+$/;

    if (!value) return showToast('ফোন নাম্বার বা ইমেইল দিন');

    if (emailRegex.test(value)) {
      setLoginMethod('email');
      setEmail(value);
      setNumber('');
    } else if (phoneRegex.test(value)) {
      setLoginMethod('phone');
      setNumber(value);
      setEmail('');
    } else return showToast('সঠিক ইমেইল বা ফোন নাম্বার দিন');

    const url =
      loginMethod === 'email' || emailRegex.test(value)
        ? `${apiBase}/recovery/verify/email`
        : `${apiBase}/otp/forgot-otp`;
    const payload =
      loginMethod === 'email' || emailRegex.test(value)
        ? { email: value }
        : { number: value };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        showToast(result.message);
        setShowStep1(false);
        setShowStep2(true);
      } else {
        showToast(result.message || 'কোনো সমস্যা হয়েছে');
      }
    } catch {
      showToast('সার্ভার সমস্যা হয়েছে');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return showToast('OTP লিখুন');

    const url =
      loginMethod === 'phone'
        ? `${apiBase}/otp/verify-otp`
        : `${apiBase}/verify/email`;
    const payload =
      loginMethod === 'phone'
        ? { number: number.trim(), otp: otp.trim() }
        : { email: email.trim(), otp: otp.trim() };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        showToast('OTP ভেরিফাই হয়েছে');
        setShowStep2(false);
        setShowStep3(true);
      } else {
        showToast(result.message || 'OTP সঠিক নয়');
      }
    } catch {
      showToast('সার্ভার সমস্যা হয়েছে');
    }
  };
const [forgetPass, { isLoading }] = useUpdatePutResourceMutation();

const onSubmitforgotPass = async (data) => {
  if (data.password !== data.con_password) {
    toast.error("Passwords do not match!");
    return;
  }

  const pass = {
    password: data.password,
    number,
    email
  };

  try {
    const res = await forgetPass({
      url: authRoutes.forgotPassword,
      tags: tagTypes.auth,
      payload: pass
    }).unwrap();

    toast.success(res?.data || "Password updated successfully!");
   setTimeout(() => onBackToLogin(), 1500);
    return;
  } catch (error) {
    console.error(error);
    toast.error(error?.data?.error || "Failed to reset password!");
  }
};


  const inputClass = 'border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-700 mb-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full';

  return (
    <div className="mx-auto p-4 bg-white rounded-lg">
      <h2 className="text-lg font-bold mb-3">পাসওয়ার্ড ভুলে গিয়েছি</h2>

      {showStep1 && (
        <form onSubmit={handleSendOtp} className="space-y-3 flex flex-col">
          <p className="text-sm font-medium text-gray-700 text-left pt-4">
            ফোন নাম্বার বা ইমেইল দিন
          </p>
          <input
            type="text"
            className={inputClass}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="মোবাইল নাম্বার বা ইমেইল দিন"
            required
          />
          <div className="flex gap-3 mt-3">
            <Button type="button" onClick={onBackToLogin}>
              <ArrowLeft className="mr-1 w-4 h-4" />
              পেছনে যাই
            </Button>
            <Button type="submit">
              এগিয়ে যাই <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {showStep2 && (
        <div className="mt-3 space-y-3">
          <input
            type="text"
            className={inputClass}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP দিন"
            required
          />
          <Button onClick={handleVerifyOtp} className="w-full">
            Verify OTP
          </Button>
        </div>
      )}

      {showStep3 && (
        <form
          onSubmit={handleSubmit(onSubmitforgotPass)}
          className="mt-3 space-y-3"
        >
          <input
            type="password"
            placeholder="New Password"
            {...register('password', { required: 'Password is required' })}
            className={inputClass}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
          <input
            type="password"
            placeholder="Confirm New Password"
            {...register('con_password', {
              required: 'Confirm your password',
            })}
            className={inputClass}
          />
          {errors.con_password && (
            <p className="text-red-500 text-sm">
              {errors.con_password.message}
            </p>
          )}
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      )}

      {toastVisible && (
        <div className="mt-3 text-sm text-center  px-3 py-2 rounded-md transition">
          {message}
        </div>
      )}
    </div>
  );
};

export default ForgotPass;

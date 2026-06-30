"use client";

import React, { useState } from "react";
import SignUp from "./Signup";
import Login from "./Login";
import ForgotPass from "./ForgotPass";

const AuthComponent = ({ allowedRole, title }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPass, setForgotPass] = useState(false);
  const allowSignup = !["admin", "teacher"].includes(allowedRole);

  if (forgotPass) {
    return (
      <div className="flex flex-col h-screen">
        <div
          className="bg-white m-6 p-6 text-center w-full max-w-md"
          style={{
            borderRadius: "8px",
            boxShadow: "0px 14px 22px rgb(42 135 158 / 14%)",
            padding: "32px 24px",
            background: "white",
          }}
        >
          <ForgotPass onBackToLogin={() => setForgotPass(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div
        className="hind bg-white p-6 text-center"
        style={{
          borderRadius: "8px",
          boxShadow: "0px 14px 22px rgb(42 135 158 / 14%)",
          background: "white",
        }}
      >
        <h2 className="text-2xl font-bold mb-4">
          {title || (activeTab === "login" ? "Login" : "Create Account")}
        </h2>

        {allowSignup && (
          <div className="flex bg-gray-100 rounded-lg overflow-hidden">
            <button
              className={`flex-1 py-2 font-semibold transition-colors duration-200 ${
                activeTab === "login"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 font-semibold transition-colors duration-200 ${
                activeTab === "signup"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("signup")}
            >
              New
            </button>
          </div>
        )}

        {activeTab === "login" ? (
          <Login expectedRole={allowedRole} />
        ) : (
          <SignUp onRegisterSuccess={() => setActiveTab("login")} />
        )}

        {allowSignup &&
          (activeTab === "login" ? (
            <button
              className="mt-4 underline text-gray-400 transition-colors duration-200"
              onClick={() => setActiveTab("signup")}
            >
              Create a new account
            </button>
          ) : (
            <button
              className="mt-4 text-gray-400 transition-colors duration-200"
              onClick={() => setActiveTab("login")}
            >
              <span>Already have an account? </span>
              <span className="underline">Login</span>
            </button>
          ))}

        <button
          className="mt-4 text-gray-400 underline mx-3"
          onClick={() => setForgotPass(true)}
        >
          Forgot password
        </button>

        <div className="mt-6 text-gray-400">
          Need help?{" "}
          <a href="tel:+8801922270004" className="text-blue-500 font-semibold">
            01947200111
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;

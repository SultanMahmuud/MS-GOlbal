import React, { useState } from "react";

import axios from "axios";
import { Button } from "@/components/UI/button";
import { Textarea } from "@/components/UI/textarea";

const Otp = ({ phoneNumber, onOtpVerified, email }) => {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      alert("Invalid phone number");
      return;
    }

    const otpValue = generateOtp();

    const data = {
      api_key: "KEY-4i36khch4gx965f2po09zcuvbas7gg9a",
      api_secret: "or1h1F4KXm8zNKt3",
      request_type: "OTP",
      message_type: "TEXT",
      mobile: phoneNumber,
      message_body: `Your OTP is: ${otpValue}`,
    };

    axios
      .post("https://portal.adnsms.com/api/v1/secure/send-sms", data)
      .then((response) => {
        setApiResponse(response.data);
        setIsOtpSent(true);
        setGeneratedOtp(otpValue);
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        alert("Failed to send OTP. Please try again.");
      });
  };

  const verifyOtp = () => {
    if (!apiResponse || apiResponse.api_response_message !== "SUCCESS") {
      alert("OTP sending failed or expired. Please resend OTP.");
      return;
    }

    if (enteredOtp === "") {
      alert("Please enter the OTP");
      return;
    }

    if (enteredOtp === generatedOtp) {
      onOtpVerified?.();
    } else {
      alert("Incorrect OTP entered");
    }
  };

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {!isOtpSent ? (
        <>
          <Textarea label="Your Phone Number" value={phoneNumber} disabled fullWidth />
          <Button variant="contained" onClick={sendOtp} fullWidth>
            Send OTP
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Enter OTP"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={verifyOtp} fullWidth>
            Verify OTP
          </Button>
        </>
      )}
    </div>
  );
};

export default Otp;

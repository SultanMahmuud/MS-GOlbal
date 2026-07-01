"use client"

import { useState } from "react"
import axios from "axios"

import {

  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,

  DialogFooter,
} from "@/components/UI/dialog"

import { Textarea } from "../UI/textarea"
import { Button } from "../UI/button"


const RegistrationAllSendSms = ({ row }) => {
  const [text, setText] = useState("")
  const [to, setTo] = useState(row?.phoneNumber || "")

  const mailHandler = async () => {
    const data = {
      api_key: process.env.REACT_APP_SMS_API,
      api_secret: process.env.REACT_APP_SMS_SECRET,
      request_type: "GENERAL_CAMPAIGN",
      message_type: "TEXT | UNICODE",
      mobile: to,
      message_body: text,
      isPromotional: 1,
      campaign_title: "Muslim School Team",
    }

    try {
      const res = await axios.post("https://portal.adnsms.com/api/v1/secure/send-sms", data)
      if (res.status === 200) {
        alert("SMS sent successfully")
        setText("")
      }
    } catch (error) {
      toast.error("Error! Something went wrong.")
    }
  }

  return (
    
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mobile SMS Sending</DialogTitle>
          <DialogDescription>Send custom text messages to this number.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Message</label>
            <Textarea
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Phone Numbers</label>
            <Textarea
              placeholder="Example: 8801717xxxxxx,8801841xxxxxx"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={mailHandler} className="w-full">
            Send SMS
          </Button>
        </DialogFooter>
      </DialogContent>
  
  )
}

export default RegistrationAllSendSms

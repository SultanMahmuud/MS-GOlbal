"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu"
import {
  Dialog,
} from "@/components/UI/dialog"

import RegistrationAllSendSms from "./RegistrationAllSendSms"
import StudentEmailInfo from "./StudentEmailInfo"


const SendMessage = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(null)

  const handleOpen = (selectedType) => {
    setType(selectedType)
    setOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            Send Message
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-2">
          <DropdownMenuItem onSelect={() => handleOpen("sms")}>
            <span className="w-full">Open SMS Dialog</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleOpen("mail")}>
            <span className="w-full">Open Mail</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Conditional Dialog Content */}
      <Dialog open={open} onOpenChange={setOpen}>
        {type === "sms" && <RegistrationAllSendSms row={{ phoneNumber: data.number }} />}
        {type === "mail" && <StudentEmailInfo email={data.email} />}
      </Dialog>
    </>
  )
}

export default SendMessage

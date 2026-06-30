'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog"
import { Button } from "@/components/UI/button"
import { Textarea } from "@/components/UI/textarea"
import useEmail from '@/components/Hooks/useMail'

const StudentEmailInfo = ({ email }) => {
  const [open, setOpen] = useState(false)
  const { mailHandler, setText, setTo, setSubject, mailLoad } = useEmail()
  const [color, setColor] = useState("white")

  return (
    <div className="w-full">
    

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sending Email</DialogTitle>
            <DialogDescription>
              <div className="space-y-4 mt-2">
                {/* Subject Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <Textarea
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 h-16"
                    placeholder="Email Subject"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <Textarea
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1 h-28"
                    placeholder="Message"
                  />
                </div>

                {/* Send Button */}
                <div>
                  <Button
                    className="w-full"
                    onClick={() => mailHandler(email, setOpen)}
                    disabled={mailLoad}
                  >
                    {!mailLoad ? 'Send Email' : "loading"}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
  
    </div>
  )
}

export default StudentEmailInfo

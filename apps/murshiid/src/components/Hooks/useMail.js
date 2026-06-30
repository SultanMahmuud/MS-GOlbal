import axios from "axios";
import { useState } from "react";

const useEmail = () => {
  const [to, setTo] = useState({});
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [mailLoad, setMailLoad] = useState(false)

  const mailHandler = (e, setOpen) => {
    setMailLoad(true)
    const data = {
        to: e,
        subject: subject,
        text: text
    };
    axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mail`, data)
    .then(function (res) {
        if (res.status === 200) {
          alert("Mail has been sent");
          setMailLoad(false);
          setOpen(false)
        }
    })
    .catch(function (error) {
        alert("error! something went wrong");
    });
  };

  return {
    mailHandler,
    setText,
    text,
    setTo,
    to,
    setSubject,
    subject,
    mailLoad
  };
};

export default useEmail;

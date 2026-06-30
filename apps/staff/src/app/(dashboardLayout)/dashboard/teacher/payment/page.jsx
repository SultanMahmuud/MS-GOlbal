'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';



const TeacherPayment = () => {

  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Assuming userData is available in the context or props
  const userData = {

    user: {
      email: 'QUT7.liyas@qawmiuniversity.live',
    },
  };
  const DateShow = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric ', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);    
  }
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/single/${userData?.user?.email}`)
      .then((res) => {
        setUser(res?.data);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [userData]);

  const paymentList = user?.data?.teacherPayment || [];

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">
        Teacher Payment
      </h2>

      <div className="bg-primary text-white font-semibold rounded-md p-3 grid grid-cols-3 text-sm md:text-base">
        <div>Month for Salary</div>
        <div>Payment Date</div>
        <div>Amount</div>
      </div>

      {paymentList.length > 0 ? (
        paymentList.map((payment, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-2 border-b py-3 px-3 text-sm md:text-base bg-white"
          >
            <div>{payment?.paymentForMonth?.toString()}</div>
            <div>{DateShow(payment?.paymentDate?.slice(0, 16))}</div>
            <div>{payment?.amountOfPayment}</div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No payment records found.
        </p>
      )}
    </div>
  );
};

export default TeacherPayment;

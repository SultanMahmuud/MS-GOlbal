import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="max-w-6xl mx-auto  py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">
        কাওমী লিমিটেডে স্বাগতম !<br />
        মূল্যফেরত নীতি
      </h1>

      {/* Paragraphs */}
      <div className="space-y-6 text-lg leading-relaxed text-gray-800">
        <p>
          একটি মূল্যফেরত অনুরোধ শুধুমাত্র তখনই বৈধ বলে বিবেচিত হবে যদি এটি 
          <a href="mailto:support@qawmiuniversity.com">
            support@qawmiuniversity.com
          </a> 
          {' '}বা{' '}
          <a href="mailto:info@qawmilimited.com">
            info@qawmilimited.com
          </a> 
          {' '}এই ২টি ইমেলের মাধ্যমে করা হয়।
        </p>

        <p>
          ভর্তি ফি, কিছু কেনাকাটা এবং মাসিক বেতন পরিশোধের ৩ দিন পর কোনো মূল্যফেরত অনুরোধ গ্রহণ করা হবে না।
        </p>

        <p>
          ইমেল করার পরে ৩ থেকে ৭ দিনের মধ্যে একটি প্রতিক্রিয়া দেওয়া হবে এবং আরও কিছু বিস্তারিত তথ্য অনুরোধ করা হবে।
        </p>

        <p>
          মূল্যফেরত অনুরোধ প্রক্রিয়া করতে ৭ থেকে ১০ দিন সময় লাগতে পারে।
        </p>

        {/* Contact Section */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">যোগাযোগ করুন</h2>
        <p>
          আমাদের রিটার্ন এবং রিফান্ড নীতি সম্পর্কে আপনার কোন প্রশ্ন থাকলে, অনুগ্রহ করে ই-মেইলের মাধ্যমে আমাদের সাথে যোগাযোগ করুন{' '}
          <a href="mailto:info@qawmilimited.com">
            info@qawmilimited.com
          </a>।
        </p>
      </div>
    </div>
  );
}

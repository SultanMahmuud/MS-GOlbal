import React from 'react';
import { FaCheckCircle, FaRegClock, FaClock } from 'react-icons/fa'; // Icons from Font Awesome

const steps = [
  {
    title: "We've received your form",
    subtitle: 'Thank you for your submission.',
    icon: <FaCheckCircle className="w-8 h-8 text-green-500" />,
    status: 'complete',
  },
  {
    title: 'Under review by our team',
    subtitle: "We're currently evaluating your information.",
    icon: <FaRegClock className="w-8 h-8 text-gray-400" />,
    status: 'in-progress',
  },
  {
    title: "We'll contact you shortly",
    subtitle: 'Expect to hear from us soon.',
    icon: <FaClock className="w-8 h-8 text-gray-400" />,
    status: 'upcoming',
  },
];

const ProgressiveTimeline = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Large check icon */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
          <FaCheckCircle className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Step cards */}
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-6 w-64 text-center flex flex-col items-center"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Timeline bar */}
      <div className="flex items-center w-full max-w-lg">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <FaCheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Line 1 */}
        <div className="flex-1 h-1 bg-green-500"></div>

        {/* Step 2 with Tailwind ping animation */}
        <div className="relative flex flex-col items-center">
          <span className="flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-white border-4 border-green-500"></span>
          </span>
        </div>

        {/* Line 2 */}
        <div className="flex-1 h-1 bg-gray-300"></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressiveTimeline;

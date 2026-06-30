import React from "react";
import { FiMail, FiMapPin, FiPhone} from "react-icons/fi";
import img from "@/assets/contact.jpg"
import ContactForm from "./ContactForm";
import Image from "next/image";
const ContactNew = () => {
  return (
   <>
 
    <div className="min-h-screen bg-white flex items-center justify-center py-10 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Hero */}
        <div className="flex flex-col justify-center items-start h-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Let’s Connect
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            We love questions and feedback –<br />
            and we’re always here to help!
          </p>
          {/* Avatar Illustration */}
          <div className="flex items-center mt-2">
            {/* Replace with your own SVG or illustration for best results */}
            <Image src={img} alt="" width={300} height={100} />
            {/* Optionally, add a waving hand emoji for friendliness */}
            
          </div>
        </div>

        {/* Right: Contact Info & Form */}
        <div className="flex flex-col gap-6">
          {/* Contact Cards */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 mb-4">
            <div className="flex items-center gap-3">
              <FiMail className="text-2xl text-green-600" />
              <div>
                <div className="font-semibold">Mail Address</div>
                <div className="text-gray-500 text-sm">support@muslimschoool.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="text-2xl text-green-600" />
              <div>
                <div className="font-semibold">Office Address</div>
                <div className="text-gray-500 text-sm">
                  455,Mirzapur,Binodpur Bazar 6206, Motihar, Rajshahi
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-2xl text-green-600" />
              <div>
                <div className="font-semibold">Phone Number</div>
                <div className="text-gray-500 text-sm">
                  01947200111
                </div>
              </div>
            </div>
          </div>

         
          <ContactForm/>
        </div>
      </div>
    </div>

  </>
  );
}

export default ContactNew
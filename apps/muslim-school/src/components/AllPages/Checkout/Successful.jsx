import Image from "next/image";
import React from "react";


const Successful = () => {
  return (
    <div>
    
      <div className="max-w-[636px] w-[90%] mx-auto">
        <div className="grid grid-cols-1 gap-6 mt-20">
          <div>
            <div className="useful abouticon_cont">
              <ul>
                <li className="inter abouiconfull">
                  <p
                    className="text-2xl leading-[37px] text-justify font-hind"
                    style={{ marginTop: "2rem" }}
                  >
                    আপনাকে অসংখ্য ধন্যবাদ <br />
                    আপনার পেমেন্ট সফল হয়েছে <br />
                  </p>
                </li>
              </ul>
            </div>
            <div className="mt-6">
              <Image
                src="https://i.ibb.co/LzCsVX9/Completed-pana.png"
                alt="Payment Successful Illustration"
                className="min-h-[200px] w-4/5 object-cover mx-auto"
                style={{ aspectRatio: "auto 200/200" }}
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Successful;

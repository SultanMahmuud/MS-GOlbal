
'use client'
import { Button } from "@/components/UI/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineDoubleArrow } from "react-icons/md";




const Library = () => {

  const [Allbook, setAllbook] = useState([]);
  // add fetch
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/book`);
      const data = await response.json();
     
      setAllbook(data);
      
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);



  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-8">
        <h2 className="text-4xl font-sans font-semibold text-gray-900 text-center mb-12">
          Academic Books
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* if no books available */}
          {Allbook?.data?.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              No books available at the moment.
            </p>
          )}
          {Allbook?.data?.map((item, index) => (
            <Link   key={item._id} href={`/show-library/${item._id}`}>
            <div
          
              className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 group"
            >
              
              {item?.rank && (
                <span className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-semibold uppercase px-2 py-1 rounded-xl">
                  {item?.rank}
                </span>
              )}

            
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  width={300}
                  height={300}
                  src={item?.image1}
                  alt={item?.title.slice(0, 50)}
                  className="w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                />
                {item?.rating && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                    <div className="inline-flex items-center bg-indigo-600 bg-opacity-75 px-3 py-1 rounded-full">
                      <span className="mr-2 font-medium">{item?.rating}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c..." />
                      </svg>
                    </div>
                    <a href={item?.excerpt} className="mt-3 text-sm underline">
                      Read Excerpt
                    </a>
                  </div>
                )}
              </div>

          
              <h3 className="mt-6 text-lg font-sans font-semibold text-gray-800 text-center">
               {item?.title.slice(0, 50)}
              </h3>
              <p className="text-center text-sm text-gray-500 uppercase mt-1">
                {item.author[0].name}
              </p>

           
              <Button className="banner-button-1 mt-6 w-full flex justify-center items-center">
                Add to Cart
                <MdOutlineDoubleArrow className="text-xl ml-2" />
              </Button>
            </div>
            </Link>
          ))}
        </div>

         
      </div>
    </section>
  );
};

export default Library;

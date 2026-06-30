import { Button } from "@/components/UI/button";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { TbClick } from "react-icons/tb";

const Feature = ({ icon, bgColor, label, value }) => (
  <div className="flex items-center">
    <div className={`${bgColor} p-2 rounded-lg`}>
      <Image
        src={icon}
        alt={label}
        className="w-6 h-6"
        width={24}
        height={24}
      />
    </div>
    <span className="ml-4 text-gray-700">{label}</span>
    <span className="ml-auto font-semibold text-gray-900">{value}</span>
  </div>
);

const ArrowIcon = () => (
  <svg
    className="w-4 h-4 ml-2"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const BookDetails = ({ singleBook }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg flex my-12">
      {/* Left: Cover */}
      <div className="flex-shrink-0">
        <Image
          src={singleBook?.data.image1}
          alt="Nature Cover"
          className="w-56 h-72 object-cover rounded-xl shadow-md"
          width={56}
          height={72}
        />
      </div>

      {/* Middle: Features & Purchase */}
      <div className="flex-1 px-6">
        <div className="space-y-4">
          <Feature
            icon="/icons/pages.svg"
            bgColor="bg-green-100"
            label="Pages"
            value="120"
          />
          <Feature
            icon="/icons/interactive.svg"
            bgColor="bg-yellow-100"
            label="Interactive"
            value="PDF"
          />
          <Feature
            icon="/icons/format.svg"
            bgColor="bg-purple-100"
            label="Format"
            value="PDF"
          />
          <Feature
            icon="/icons/filesize.svg"
            bgColor="bg-red-100"
            label="File Size"
            value="1 MB"
          />
        </div>

        <div className="mt-6 flex items-baseline">
          <span className="text-gray-600 mr-2">Price:</span>
          <span className="text-2xl font-bold text-gray-900">
            ৳{singleBook?.data.price}
          </span>
        </div>

        <Link href={`/check-out/${singleBook?.data._id}`}>
          <Button className="banner-button-1 w-full mt-4 roundwed-lg flex justify-center items-center">
            Add to Cart
            <MdOutlineDoubleArrow className="text-xl" />
          </Button>
        </Link>
      </div>

      {/* Right: Preview & FAQ */}
      <div className="w-1/3 pl-6 border-l border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Book Preview</h3>
          <button className="bg-green-50 text-green-600 px-4 py-1 rounded-lg font-medium hover:bg-green-100 transition flex items-center gap-2">
            See More  <TbClick className="text-sm" />
          </button>
        </div>

        <Image
          src={singleBook?.data.image1}
          alt="Main Preview"
          className="mt-4 w-full h-40 object-cover rounded-lg shadow-sm"
          width={100}
          height={100}
        />

        <div className="mt-3 flex space-x-2">
          <Image
            src={singleBook?.data.image1}
            alt="Preview 1"
            className="w-16 h-16 object-cover rounded-md"
            width={60}
            height={60}
          />
          <Image
            src={singleBook?.data.image2}
            alt="Preview 2"
            className="w-16 h-16 object-cover rounded-md"
            width={60}
            height={60}
          />
          <Image
            src={singleBook?.data.image3}
            alt="Preview 3"
            className="w-16 h-16 object-cover rounded-md"
            width={60}
            height={60}
          />
        </div>

        <details className="mt-6">
          <summary className="cursor-pointer font-medium">
            FAQ (Frequently Asked Questions)
          </summary>
          <div className="mt-2 text-gray-700">
            {/* Your FAQ content here */}
            <p>Q1: How do I download the book?</p>
            <p>
              A1: After purchase, you’ll get an email with your download link.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default BookDetails;

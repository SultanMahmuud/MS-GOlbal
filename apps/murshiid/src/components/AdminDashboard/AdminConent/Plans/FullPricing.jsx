import { useRef, useState } from "react";
import axios from "axios";

const FullPricing = () => {
  const pricingData = useRef({});
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  const getInputField = (e) => {
    pricingData.current[e.target.name] = e.target.value;
  };

  const onSubmit = () => {
    if (pricingData.current?.batch_full_desc) {
      const newdata = pricingData.current;
      setLoading(true);

      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/pricingplan/batch/62fe235707df0fb059cf7298`,
          newdata
        )
        .then(() => {
          setUpdated(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });

      pricingData.current = {};
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 font-hind">
        Full Pricing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2">
            <button className="bg-white font-medium px-3 py-1 rounded shadow text-sm font-hind">
              Heading
            </button>
            <textarea
              className="w-full border-none shadow-md rounded p-2 font-inter text-sm"
              name="batch_full_desc"
              placeholder="Put a comma between two tags"
              onChange={getInputField}
              rows="5"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-white font-medium px-3 py-1 rounded shadow text-sm font-hind">
              Price
            </button>
            <input
              type="number"
              name="batch_full_price"
              placeholder="Enter heading..."
              onChange={getInputField}
              className="w-full border-none shadow-md rounded p-2 font-inter text-sm"
            />
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col justify-end">
          <div className="mt-8">
            <button
              onClick={onSubmit}
              className="w-full bg-white font-medium px-4 py-2 rounded shadow text-sm font-hind"
            >
              {loading ? "Publishing..." : updated ? "Published" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPricing;

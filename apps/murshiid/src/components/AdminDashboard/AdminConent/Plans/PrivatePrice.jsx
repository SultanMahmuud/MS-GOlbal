import axios from 'axios';
import { useRef, useState } from 'react';


const PrivatePrice = ({ day }) => {

  const pricingData = useRef({});
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const getInputField = (e) => {
    pricingData.current[e.target.name] = e.target.value;
  };

  const onSubmit = () => {
    const containerData = {};
    containerData[day] = pricingData.current;
    setLoading(true);

    axios
      .put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pricingplan/batch/62fe235707df0fb059cf7298`,
        containerData
      )
      .then((response) => {
        setUpdated(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const renderInputBlock = (title, headingName, priceName) => (
    <>
      <h3 className="text-blue-700 text-base font-bold border-b-[5px] border-yellow-400 inline-block mt-6 mb-2">
        {title}
      </h3>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-10 space-y-4">
          <div className="flex items-start gap-4">
            <span className="bg-white shadow px-4 py-1 rounded text-blue-700 font-medium">
              Heading
            </span>
            <textarea
              name={headingName}
              rows="5"
              cols="150"
              placeholder="put comma between two tags"
              onChange={getInputField}
              className="w-full rounded-md shadow p-2 resize-none"
            ></textarea>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-white shadow px-4 py-1 rounded text-blue-700 font-medium">
              Price
            </span>
            <input
              type="number"
              name={priceName}
              placeholder="Enter price..."
              onChange={getInputField}
              className="border border-gray-300 px-3 py-2 rounded-md w-full max-w-xs"
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="mt-8">
      <h2 className="bg-yellow-400 text-white font-bold text-lg px-6 py-2 inline-block rounded">
        {day}
      </h2>

      {renderInputBlock("30 minutes", "heading_30", "price_30")}
      {renderInputBlock("40 minutes", "heading_40", "price_40")}
      {renderInputBlock("1 hour", "heading_1hr", "price_1hr")}

      <button
        onClick={onSubmit}
        className={`mt-8 px-6 py-2 rounded text-white font-semibold ${
          updated ? 'bg-green-600' : 'bg-blue-700'
        }`}
      >
        {updated ? 'Published' : 'Publish'}
      </button>
    </div>
  );
};

export default PrivatePrice;

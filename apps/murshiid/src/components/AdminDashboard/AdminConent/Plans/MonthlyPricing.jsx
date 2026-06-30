import { useRef, useState } from 'react';
import axios from 'axios';


const MonthlyPricing = () => {


  const pricingData = useRef({});
  const [updated, setUpdated] = useState(false);

  const getInputField = (e) => {
    pricingData.current[e.target.name] = e.target.value;
  };

  const onSubmit = () => {
    if (pricingData.current?.batch_monthly_desc) {
      const newdata = pricingData.current;

      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/pricingplan/batch/62fe235707df0fb059cf7298`,
          newdata,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
        .then(() => setUpdated(true))
        .catch(() => alert('Failed to update'));

      pricingData.current = {};
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Monthly Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Heading textarea */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Heading</label>
            <textarea
              name="batch_monthly_desc"
              placeholder="Put comma between two tags"
              onChange={getInputField}
              rows="5"
              className="w-full p-3 rounded-lg border shadow text-sm"
            />
          </div>

          {/* Price input */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Price</label>
            <input
              type="number"
              name="batch_monthly_price"
              placeholder="Enter price..."
              onChange={getInputField}
              className="w-full p-3 rounded-lg border shadow text-sm"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex flex-col justify-end">
          <button
            onClick={onSubmit}
            className="w-full mt-6  text-white font-medium py-2 rounded  transition"
          >
            {updated ? 'Published' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPricing;

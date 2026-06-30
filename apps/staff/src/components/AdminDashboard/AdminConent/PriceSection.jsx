import React, { useState } from 'react';
import Plan1 from './Plans/Plan1';
import Plan2 from './Plans/Plan2';



const PricingSection = () => {
  const [pri, setPri] = useState('batch'); // Local state instead of Redux

  const handleLanguage = (e) => {
    setPri(e.target.value);
  };

  return (
    <>
      <div>
        <select
          id="contentInput"
          defaultValue="batch"
          onChange={handleLanguage}
          style={{
            fontSize: '15px',
            width: "150px",
            background: 'gary',
            borderRadius: "8px",
          }}
        >
          <option
            style={{ padding: "8px 14px" }}
            className="inter"
            value="batch"
          >
            Batch
          </option>
          <option
            style={{ padding: "8px 14px" }}
            className="inter"
            value="private"
          >
            Private
          </option>
        </select>
      </div>
      {pri === 'batch' ? <Plan1 /> : pri === 'private' ? <Plan2 /> : null}
    </>
  );
};

export default PricingSection;

import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { MdExpandMore } from 'react-icons/md';
import { COLORS, FAMILY, FONTS, RADIUS, SIZES } from '../../../constants';
import '../button.scss';
import { Button } from 'react-scroll';
import ButtonStyle from './ButtonStyle';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const PaymentFaq = () => {
  const [faqData, setFaqData] = useState([]);
  const [expandedPanel, setExpandedPanel] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/faq`)
      .then(response => response.json())
      .then(data => {
        const paymentData = data.data.filter(item => item.category === "পেমেন্ট");
        setFaqData(paymentData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = panel => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : null);
  };
  const data = useSelector((state) => state.course);
  const navigate = useNavigate();
  const handleEnrollNow = () => {
      navigate(`/check-out/${data?.singleCourse?.data?._id}`);
    
  };

  return (
    <div style={{ marginBottom: '50px',background:'white' }}>
      <div>
        {faqData.map((item, index) => (
          <div> 
             <Accordion defaultExpanded={index===0}
          style={{ borderRadius: RADIUS.md }}
          sx={{ boxShadow:'0 2px 4px 0 rgba(0,0,0,.08)', mb: 1 , }}
        >
          <AccordionSummary
            expandIcon={<MdExpandMore style={{fontSize:'24px'}}/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{padding: '8px 16px',borderRadius: '8px'}}
          >
            <Typography
              className="hind"
              sx={{ fontSize: SIZES.regular, fontWeight: FONTS.bold,color:COLORS.secondary }}
            >
            {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ fontSize: SIZES.regular,fontWeight: FONTS.bold,color:COLORS.secondary }} className="inter">
              {
                item?.answer
              }
            </Typography>
          </AccordionDetails>
        </Accordion> 
      
        </div>
        ))}
      </div>
      <ButtonStyle label={'এখনই ভর্তি হোন'} lg={'40%'} margin={'auto'} onClick={handleEnrollNow}></ButtonStyle>
    </div>
  );
};

export default PaymentFaq;

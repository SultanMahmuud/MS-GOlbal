import CourseTitle from "@/components/Shared/CourseTitle";
import React, { useState, useEffect } from "react";
import { Element, Link as ScrollLink } from "react-scroll";
import WhatLearn from "./WhatLearn";
import WhatGetInCourse from "./WhatGetInCourse";
import CallUs from "./CallUs";
import CourseForWhom from "./CourseForWhom";

import WhyLearnCard from "./WhyLearnCard";
import CourseStudentFaq from "./CourseStudentFaq";
import Curriculum from "./Curriculum";
import PaymentFaq from "@/components/AdminDashboard/AdminCourse/CourseFaq";
import StudentReviewOfCourse from "./StudentReviewOfCourse";
import SectionTitle from "@/components/Shared/SectionTitle/SectionTitle";
import ReviewCard from "../ReviewPage/ReviewCard";
import { Button } from "@/components/UI/button";


const LearnCourseTab = ({ course }) => {
  const [activeSection, setActiveSection] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 600);
  }, []);

  const handleSetActive = (to) => {
    setActiveSection(to || "");
  };

  const whatLearn = course?.whatLearn?.length > 0;
  const whatYouGet = course?.whatYouGet?.length > 0;
  const courseForWhom = course?.courseForWhom?.length > 0;
  const courseWhy = course?.courseWhy?.length > 0;

  const sectionLink = (id, label) => (
    <ScrollLink
      to={id}
      smooth={true}
      duration={500}
      spy={true}
      offset={-70}
      onSetActive={() => handleSetActive(id)}
      className={`text-[16px] font-semibold px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer ${
        activeSection === id ? "bg-primary py-1 text-white" : "navColor"
      } hover:text-green-500`}
    >
      {label}
    </ScrollLink>
  );

  return (
    <div className="w-full">
      {isDesktop && (
        <div className="sticky top-[70px] z-40 bg-[#f8fffc] shadow-md rounded-b-lg justify-center py-4 space-x-1 lg:block hidden pl-2">
          {whatLearn && sectionLink("what-learn", "কোর্সে কি শিখবেন")}
          {whatYouGet && sectionLink("what-get", "কোর্সে আপনি পাচ্ছেন")}
          {courseForWhom && sectionLink("for-whom", "কোর্সটি যাদের জন্য")}
          {sectionLink("course-curriculum", "কোর্স কারিকুলাম")}
          {courseWhy && sectionLink("why-learn", "কেন শিখবেন")}
          {sectionLink("what-student-says", "স্টুডেন্ট রিভিউ")}
          {sectionLink("what-student-asks", "প্রশ্নোত্তর")}
        </div>
      )}

      {whatLearn && (
        <Element name="what-learn">
          <section id="what-learn">
            <SectionTitle secondaryText="কোর্সে কি শিখবেন" underlineWidth="w-full"/>
            <WhatLearn data={course}/>
          </section>
        </Element>
      )}

      {whatYouGet && (
        <Element name="what-get">
          <section id="what-get">
            <SectionTitle secondaryText="কোর্সে আপনি পাচ্ছেন" underlineWidth="w-full"/>
            <WhatGetInCourse data={course}/>
          </section>
        </Element>
      )}

      <Element name="call">
        <section>
          <CallUs />
        </section>
      </Element>

      {courseForWhom && (
        <Element name="for-whom">
          <section id="for-whom">
              <SectionTitle secondaryText="কোর্সটি যাদের জন্য" underlineWidth="w-full"/>
            <CourseForWhom data={course}/>
          </section>
        </Element>
      )}

      <Element name="course-curriculum">
        <section id="course-curriculum">
          <SectionTitle secondaryText="কোর্স কারিকুলাম" underlineWidth="w-full"/>
          <Curriculum data={course}/>
        </section>
      </Element>

      {courseWhy && (
        <Element name="why-learn">
          <section id="why-learn">
            <SectionTitle primaryText={course?.courseWhyTitle.primaryTopTitle} secondaryText={course?.courseWhyTitle.secondaryTopTitle} underlineWidth="w-full"/>
            <WhyLearnCard  data={course}/>
          </section>
        </Element>
      )}

      <Element name="what-student-says">
        <section id="what-student-says">
          <SectionTitle primaryText="শিক্ষার্থীরা" secondaryText="যা বলছে" underlineWidth="w-full"/>
          <ReviewCard />
          <div className="flex w-full  items-center justify-between mt-20">
            <Button className="w-[45%] banner-button-1">আরও দেখুন</Button>
            <Button className="w-[45%] banner-button-1">এখনই ভর্তি হোন</Button>
          </div>
        </section>
      </Element>

      <Element name="what-student-asks">
        <section id="what-student-asks">
          <SectionTitle primaryText="প্রায়ই" secondaryText="জিজ্ঞেস করা প্রশ্ন" underlineWidth="w-full"/>
          <CourseStudentFaq data={course}/>
           <div className="flex w-full  items-center justify-center">
            <Button className="w-[45%] banner-button-1">আরও দেখুন</Button>
            
          </div>
        </section>
      </Element>

      <Element name="what-student-asks-payment">
        <section id="what-student-asks-payment">
          <SectionTitle primaryText="পেমেন্ট" secondaryText="কিভাবে করব?" underlineWidth="w-full"/>
          <PaymentFaq data={course}/>
          <div className="flex w-full  items-center justify-center">
            <Button className="w-[45%] banner-button-1">এখনই ভর্তি হোন</Button>
            
          </div>
        </section>
      </Element>
    </div>
  );
};

export default LearnCourseTab;

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";

import TeacherAddBox from "@/components/AdminDashboard/AdminCourse/TeacherAddBox";
import { useRouter } from "next/navigation";
import Topcolumn  from "@/components/AdminDashboard/AdminCourse/UpdateCourse/Topcolumn"
import CourseCurriculumSelector from "@/components/AdminDashboard/AdminCourse/CourseCurriculumSelector";
const UpdateCourse = ({ params }) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.courseId;
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [engTitle, setengTitle] = useState("");

  const [courseDesc, setCourseDesc] = useState("");
  const [curriculum, setCurriculum] = useState([]);
  const [curriculumId, setCurriculumId] = useState("");
  const [faq, setFaq] = useState([]);
  const [pay, setPay] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [instructor, setInstructor] = useState([]);
  const [medium, setMedium] = useState("Record Course");
  const [courseCategory, setCourseCategory] = useState("Reading Quran");
  const [courseRank, setCourseRank] = useState("bestseller");
  const [courseLevel, setCourseLevel] = useState("Level1");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [duration, setDuration] = useState("");
  const [certificate, setCertificate] = useState(false);
  const [totalLesson, setTotalLesson] = useState("");
  const [lifeTimeAccess, setLifeTimeAccess] = useState(false);
  const [article, setArticle] = useState("");
  const [featuredVideo, setFeaturedVideo] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [teacher, setTeacher] = useState([]);
  const [courseTime, setCourseTime] = useState("");
  const [courseSeat, setCourseSeat] = useState("");
  const [courseDate, setCourseDay] = useState("");
  const [banPrice, setBanPrice] = useState("");
  const [banSalePrice, setBanSalePrice] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [studentTotal, setTotalStudent] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [singleHighlighter, setSingleHighlighter] = useState("");
  const [PromoCode, setPromoCode] = useState("");
  const [PromoPercentage, setPromoPercentage] = useState("");

  const [courseFuture, setCourseFuture] = useState({
    courseF1: "",
    courseF2: "",
    courseF3: "",
    courseF4: "",
    courseF5: "",
    courseF6: "",
    courseF7: "",
    courseF8: "",
    courseF9: "",
    courseF10: "",
  });

  const [totalEnroll, setTotalEnroll] = useState("");
  const [classNote, setClassNote] = useState("");
  const [lectures, setLectures] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [totalLiveClass, setTotalLiveClass] = useState("");
  const [classVideoNote, setClassVideoNote] = useState("");
  const [coursedetailsLevel, setCoursedetailsLevel] = useState("");
  const [courseFee, setCourseFee] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseEnrolled, setCourseEnrolled] = useState("");

  const [whatLearn, setWhatLearn] = useState([{ title: "", uploadUrl: "" }]);
  const [whatYouGet, setWhatYouGet] = useState([
    { uploadUrl: "", title: "", engTitle: "" },
  ]);
  const [courseForWhom, setcourseForWhom] = useState([{ title: "" }]);

  const [courseWhy, setcourseWhy] = useState([
    { uploadUrl: "", title: "", subtitle: "", layout: "" },
  ]);
  const [courseWhyTitle, setCourseWhyTitle] = useState({
    primaryTopTitle: "",
    secondaryTopTitle: "",
  });
  const handleDeleteLesson = ({ Mindex, lesson, Lindex }) => {
    const newLessons = curriculum[Mindex].lessons.filter(
      (item, index) => index !== Lindex
    );

    const newCurriCulum = curriculum.map((item, index) => {
      if (index === Mindex) {
        item.lessons = newLessons;
        return item;
      } else {
        return item;
      }
    });

    setCurriculum(newCurriCulum);
  };

  const AddNewLessonFunc = (newLesson, addIndex) => {
    let lessons = curriculum[addIndex.Mindex]?.lessons;

    lessons?.splice(addIndex.Lindex + 1, 0, newLesson);

    const newCurr = curriculum.map((item, index) => {
      if (index === addIndex.Mindex) {
        item.lessons = lessons;
        return item;
      } else {
        return item;
      }
    });

    setCurriculum(newCurr);
  };
  useEffect(() => {
    if (id) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/course/single-admin/${id}`
        )
        .then((res) => {
          const data = res?.data?.data;
        
          if (data) {
            setCourseTitle(data.title || "");
            setSubtitle(data.subTitle || "");
            setengTitle(data.engTitle || "");
            setCourseDesc(data.description || "");
            setCurriculum(data.curriculum || []);
            setCurriculumId(data.curriculumId || "");
            setFaq(data.FAQ || []);
            setPay(data.pay || []);
            setAnnouncement(data.announcement || "");
            setFeaturedImage(data.image || "");
            setInstructor(data.instructor || []);
            setMedium(data.medium || "");
            setCourseCategory(data.category || "");
            setCourseRank(data.rank || "");
            setCourseLevel(data.level || "");
            setPrice(data.price || "");
            setSalePrice(data.salePrice || "");
            setDuration(data.durationHr || "");
            setCertificate(data.certificate || false);
            setTotalLesson(data.lesson || "");
            setLifeTimeAccess(data.access || false);
            setArticle(data.article || "");
            setFeaturedVideo(data.featuredVideo || "");
            setVisibility(data.visibility || "Public");
            setTeacher(data.teacherInfo || []);
            setCourseTime(data.courseTime || "");
            setCourseSeat(data.courseSeat || "");
            setCourseDay(data.courseDay || "");
            setBanPrice(data.banPrice || "");
            setBanSalePrice(data.banSalePrice || "");
            setTotalStudent(data.studentTotal || "");
            setTeacherName(data.teacherName || "");
            setSingleHighlighter(data.singleHighlighter || "");
            setPromoCode(data.PromoCode || "");
            setPromoPercentage(data.PromoPercentage || "");
            setCourseFuture(data.courseFuture || {});
            setWhatLearn(data.whatLearn || [{ title: "", uploadUrl: "" }]);
            setWhatYouGet(
              data.whatYouGet || [{ uploadUrl: "", title: "", subtitle: "" }]
            );
            setcourseForWhom(data.courseForWhom || [{ title: "" }]);
            setcourseWhy(
              data.courseWhy || [
                { uploadUrl: "", title: "", subtitle: "", layout: "" },
              ]
            );
            setCourseWhyTitle({
              primaryTopTitle: data.courseWhyTitle.primaryTopTitle || "",
              secondaryTopTitle: data.courseWhyTitle.secondaryTopTitle || "",
            });

            setTotalEnroll(data.totalEnroll || "");
            setClassNote(data.classNote || "");
            setLectures(data.lectures || "");
            setCourseDuration(data.courseDuration || "");

            setTotalLiveClass(data.coursedetails.totalLiveClass || "");
            setClassVideoNote(data.coursedetails.classVideoNote || "");
            setCoursedetailsLevel(data.coursedetails.level || "");
            setCourseFee(data.coursedetails.courseFee || "");
            setCourseDescription(data.coursedetails.courseDescription || "");
            setCourseEnrolled(data.coursedetails.courseEnrolled || "");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch course details", err);
        });
    }
  }, [id]);
  const renderCourseFutures = () => {
    const fields = [];
    for (let i = 1; i <= 10; i++) {
      const fieldName = `courseF${i}`;
      fields.push(
        <div key={fieldName} className="w-full md:w-1/2 px-2 mb-4">
          <input
            type="text"
            placeholder={`Enter Course Future ${i}`}
            value={courseFuture[fieldName] || ""}
            onChange={(e) =>
              setCourseFuture({
                ...courseFuture,
                [fieldName]: e.target.value,
              })
            }
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      );
    }
    return fields;
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/category`)
      .then(function (response) {
        const data = response?.data?.data[0];
        const newCate = data?.batch?.concat(data.course);
        setAllCategory(newCate.map((cat) => cat.category));
      })
      .catch(function (error) {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCertificateClick = () => {
    setCertificate(!certificate);
  };

  const addInputField = (setter, template) => {
    setter((prev) => [...prev, template]);
  };

  const handleInputChange = (index, field, inputValue, stateSetter) => {
    stateSetter((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = {
        ...updatedState[index],
        [field]: inputValue,
      };
      return updatedState;
    });
  };

  const handleDelete = (index, stateSetter) => {
    stateSetter((prevState) => {
      const updatedState = [...prevState];
      updatedState.splice(index, 1);
      return updatedState;
    });
  };
  const handleEditLesson = (editedLesson) => {
    const newLessons = curriculum[editedLesson?.Mindex]?.lessons?.map(
      (item, index) => {
        if (index === editedLesson?.Lindex) {
          return editedLesson?.lesson;
        } else {
          return item;
        }
      }
    );

    let newCurriCulum = curriculum.map((item, index) => {
      if (index === editedLesson?.Mindex) {
        item.moduleName = editedLesson?.moduleName;
        item.lessons = newLessons;
        return item;
      } else {
        return item;
      }
    });

    setCurriculum(newCurriCulum);
  };
  const handleDeleteModule = (Mindex) => {
    const newCurr = curriculum.filter((item, index) => index !== Mindex);

    setCurriculum(newCurr);
  };

  const handleAddNewModule = (NewModule) => {
    const newCurr = curriculum;
    newCurr?.splice(NewModule.Mindex + 1, 0, NewModule.module);
    const curr = newCurr.map((item) => item);
    setCurriculum(curr);
  };

  const handlePublish = async (courseType) => {
    const newCourse = {
      id: id,
      title: courseTitle,
      subTitle: subtitle,
      engTitle: engTitle,
      image: featuredImage? featuredImage : "",
      category: courseCategory,
      createdBy: "Admin",
      lesson: totalLesson,
      durationHr: duration,
      certificate: certificate,
      article: article,
      medium: medium,
      access: lifeTimeAccess,
      level: courseLevel,
      teacherInfo: teacher,
      salePrice: salePrice,
      price: price,
      description: courseDesc,
      curriculumId: curriculumId || undefined,
      curriculum: curriculum,
      FAQ: faq,
      pay: pay,
      rank: courseRank,
      visibility: visibility,
      announcement: announcement,
      courseType: courseType,
      featuredVideo: featuredVideo,
      courseFuture: courseFuture,
      courseTime: courseTime,
      courseSeat: courseSeat,
      courseDay: courseDate,
      singleHighlighter: singleHighlighter,
      banPrice: banPrice,
      banSalePrice: banSalePrice,
      teacherName: teacherName,
      studentTotal: studentTotal,
      whatLearn: whatLearn,
      whatYouGet: whatYouGet,
      courseForWhom: courseForWhom,
      courseWhy: courseWhy,
      courseWhyTitle,
      PromoCode: PromoCode,
      PromoPercentage: PromoPercentage,
      totalEnroll: totalEnroll,
      classNote: classNote,
      lectures: lectures,
      courseDuration: courseDuration,

      coursedetails: {
        totalLiveClass,
        classVideoNote,
        level: coursedetailsLevel,
        courseFee,
        courseDescription,
        courseEnrolled,
      },
    };

    try {
      await axios.put(`${BASE_URL}/course/update`, newCourse);
      alert("Course updated successfully!");
      return router.push("/dashboard/admin/course");
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Failed to save course. Please try again.");
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/role/teacher`)
      .then((res) => {
        setTeacher(res?.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  }, []);

  const handleDeleteCourse = async () => {
    if (window.confirm("are you sure")) {
      await axios.delete(`${BASE_URL}/course/delete/${id}`);
      return router.push("/dashboard/admin/course");
    }
  };
  const handleDeleteFaq = ( FaqIndex) => {
    const newFaq = faq.filter((item, index) => index !== FaqIndex);

    setFaq(newFaq);
  };
  const handleDeletePay = (FaqIndex) => {
   
    const newFaq = pay.filter((item, index) => index !== FaqIndex);

    setPay(newFaq);
  };

  const inputStyles =
    "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2";
  const cardStyles = "bg-white rounded-lg shadow-md p-4 mt-4";

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl p-5 font-semibold">Create Course</h3>
        <div className="flex flex-col">
          <div className="lg:w-3xl xl:w-[90%] mx-auto lg:m-6">
            <CourseCurriculumSelector
              selectedCurriculumId={curriculumId}
              setSelectedCurriculumId={setCurriculumId}
            />
          </div>
          <Topcolumn
            inputStyles={inputStyles}
            cardStyles={cardStyles}
            courseTitle={courseTitle}
            setCourseTitle={setCourseTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            engTitle={engTitle}
            setengTitle={setengTitle}
            featuredVideo={featuredVideo}
            setFeaturedVideo={setFeaturedVideo}
            courseDesc={courseDesc}
            setCourseDesc={setCourseDesc}
            curriculum={curriculum}
            handleDeleteLesson={handleDeleteLesson}
            handleEditLesson={handleEditLesson}
            AddNewLessonFunc={AddNewLessonFunc}
            handleDeleteModule={handleDeleteModule}
            handleAddNewModule={handleAddNewModule}
            faq={faq}
            pay={pay}
            setPay={setPay}
            handleDeleteFaq={handleDeleteFaq}
            handleDeletePay={handleDeletePay}
            setFaq={setFaq}
            announcement={announcement}
            setAnnouncement={setAnnouncement}
            whatLearn={whatLearn}
            setWhatLearn={setWhatLearn}
            whatYouGet={whatYouGet}
            setWhatYouGet={setWhatYouGet}
            courseForWhom={courseForWhom}
            setcourseForWhom={setcourseForWhom}
            courseWhy={courseWhy}
            setcourseWhy={setcourseWhy}
            courseWhyTitle={courseWhyTitle}
            setCourseWhyTitle={setCourseWhyTitle}
            handleInputChange={handleInputChange}
            handleDelete={handleDelete}
            addInputField={addInputField}
          />

          {/* Right Column */}
          <div className="lg:w-3xl xl:w-[90%] mx-auto lg:m-6">
            <div className={cardStyles}>
              <h3 className="text-lg font-semibold mb-4">Course Settings</h3>

              <div className="mb-6">
                <CommonFileUpload
                  url={featuredImage}
                  setUrl={setFeaturedImage}
                />
              </div>
              <div className="flex gap-2 w-full justify-between">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medium
                  </label>
                  <select
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className={inputStyles}
                  >
                    <option value="সিঙ্গেল লাইভ ক্লাস">
                      সিঙ্গেল লাইভ ক্লাস
                    </option>
                    <option value="লাইভ ব্যাচ">লাইভ ব্যাচ</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Category
                  </label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className={inputStyles}
                  >
                    {allCategory.map((option ,idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rank
                  </label>
                  <select
                    value={courseRank}
                    onChange={(e) => setCourseRank(e.target.value)}
                    className={inputStyles}
                  >
                    {[
                      "None",
                      "Hot",
                      "New",
                      "Bestseller",
                      "Popular",
                      "Special",
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher
                  </label>
                  <TeacherAddBox setTeacher={setTeacher} teacher={teacher} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher Name
                  </label>
                  <input
                    className={inputStyles}
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Teacher Name"
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className="block text-2xl font-bold text-gray-700 mb-2">
                  Price Section
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      className={inputStyles}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <input
                      className={inputStyles}
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="Sale Price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bangla Price
                    </label>
                    <input
                      className={inputStyles}
                      value={banPrice}
                      onChange={(e) => setBanPrice(e.target.value)}
                      placeholder="Bangla Price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bangla Sale Price
                    </label>
                    <input
                      className={inputStyles}
                      value={banSalePrice}
                      onChange={(e) => setBanSalePrice(e.target.value)}
                      placeholder="Bangla Sale Price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <input
                      className={inputStyles}
                      value={PromoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo Code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Percentage
                    </label>
                    <input
                      type="number"
                      className={inputStyles}
                      value={PromoPercentage}
                      onChange={(e) => setPromoPercentage(e.target.value)}
                      placeholder="Promo Percentage"
                    />
                  </div>
                </div>
              </div>

              <label className="block text-2xl font-bold text-gray-700 mb-2">
                Student Facility
              </label>
              <div className="flex  gap-4 mb-4 w-full justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Enrolled
                  </label>
                  <input
                    type="number"
                    className={inputStyles}
                    value={totalEnroll}
                    onChange={(e) => setTotalEnroll(e.target.value)}
                    placeholder="Total Enrolled"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Note
                  </label>
                  <input
                    className={inputStyles}
                    value={classNote}
                    onChange={(e) => setClassNote(e.target.value)}
                    placeholder="Class Note"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lecture
                  </label>
                  <input
                    className={inputStyles}
                    value={lectures}
                    onChange={(e) => setLectures(e.target.value)}
                    placeholder="Lectures"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    className={inputStyles}
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="Duration"
                  />
                </div>
              </div>
              <label className="block text-2xl font-bold text-gray-700 mt-6 mb-2">
                Course Details page Features
              </label>
              <div className="flex  gap-4 mb-4 w-full justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Live Class
                  </label>
                  <input
                    type="number"
                    className={inputStyles}
                    value={totalLiveClass}
                    onChange={(e) => setTotalLiveClass(e.target.value)}
                    placeholder="Total Live Class"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Video Note
                  </label>
                  <input
                    className={inputStyles}
                    value={classVideoNote}
                    onChange={(e) => setClassVideoNote(e.target.value)}
                    placeholder="Class Video Note"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <input
                    className={inputStyles}
                    value={coursedetailsLevel}
                    onChange={(e) => setCoursedetailsLevel(e.target.value)}
                    placeholder="Level"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Fee
                  </label>
                  <input
                    className={inputStyles}
                    value={courseFee}
                    onChange={(e) => setCourseFee(e.target.value)}
                    placeholder="Course Fee"
                  />
                </div>
              </div>

              <div className="flex  gap-4 mb-4 w-full items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Description
                  </label>
                  <input
                    className={inputStyles}
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Course Description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Enrolled
                  </label>
                  <input
                    className={inputStyles}
                    value={courseEnrolled}
                    onChange={(e) => setCourseEnrolled(e.target.value)}
                    placeholder="Course Enrolled"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 mt-6">
                    <span className="text-lg font-medium">Certificate </span>
                    <input
                      type="checkbox"
                      checked={certificate}
                      onChange={handleCertificateClick}
                      className="mr-2"
                    />
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="block text-2xl font-bold text-gray-700 mb-2">
                  Course Futures
                </h4>
                <div className="flex flex-wrap -mx-2">
                  {renderCourseFutures()}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="block text-2xl font-bold text-gray-700 mb-2">
                  Course Highlighters
                </h4>
                <div className="space-y-4 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Course Time"
                    onChange={(e) => setCourseTime(e.target.value)}
                    className={inputStyles}
                    value={courseTime}
                  />
                  <input
                    type="text"
                    placeholder="Course Seat"
                    onChange={(e) => setCourseSeat(e.target.value)}
                    className={inputStyles}
                    value={courseSeat}
                  />
                  <input
                    type="text"
                    placeholder="Course Day"
                    onChange={(e) => setCourseDay(e.target.value)}
                    className={inputStyles}
                    value={courseDate}
                  />
                  <input
                    type="text"
                    placeholder="Single Highlighter"
                    onChange={(e) => setSingleHighlighter(e.target.value)}
                    className={inputStyles}
                    value={singleHighlighter}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handlePublish("final")}
                  className="flex-1 px-2 py-3 bg-primary text-white rounded-lg  transition duration-200"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteCourse()}
                  className="flex-1 px-2 py-3 bg-red-500 text-white rounded-lg  transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;

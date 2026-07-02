"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import CommonFileUpload from "@/components/Shared/FileUpload/CommonFileUpload";

import TeacherAddBox from "@/components/AdminDashboard/AdminCourse/TeacherAddBox";
import { useRouter } from "next/navigation";
import Topcolumn  from "@/components/AdminDashboard/AdminCourse/UpdateCourse/Topcolumn"
import CourseCurriculumSelector from "@/components/AdminDashboard/AdminCourse/CourseCurriculumSelector";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const UpdateCourse = ({ params }) => {
  const BASE_URL = getApiBaseUrl();

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.courseId;
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [engTitle, setengTitle] = useState("");

  const [courseDesc, setCourseDesc] = useState("");
  const [curriculum, setCurriculum] = useState([]);
  const [curriculumId, setCurriculumId] = useState("");
  const [brandKey, setBrandKey] = useState("muslim-school");
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
          `${BASE_URL}/course/single-admin/${id}`,
          {
            headers: {
              ...getBrandHeaders(),
              ...getAuthHeaders(),
            },
          }
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
            setBrandKey(data.brandKey || "muslim-school");
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
        <div key={fieldName}>
          <input
            type="text"
            placeholder={`Enter Course Feature ${i}`}
            value={courseFuture[fieldName] || ""}
            onChange={(e) =>
              setCourseFuture({
                ...courseFuture,
                [fieldName]: e.target.value,
              })
            }
            className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors"
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
    if (courseType === "final" && visibility === "Public") {
      if (!brandKey) {
        alert("Brand is required to publish the course.");
        return;
      }
      if (!curriculumId) {
        alert("A central published curriculum is required to publish the course.");
        return;
      }
    }

    const newCourse = {
      id: id,
      title: courseTitle,
      subTitle: subtitle,
      engTitle: engTitle,
      image: featuredImage? featuredImage : "",
      category: courseCategory,
      createdBy: "Admin",
      brandKey: brandKey,
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
      await axios.put(`${BASE_URL}/course/update`, newCourse, {
        headers: {
          ...getBrandHeaders(),
          ...getAuthHeaders(),
        },
      });
      alert("Course updated successfully!");
      return router.push("/dashboard/admin/course");
    } catch (error) {
      console.error("Error saving course:", error);
      alert(error.response?.data?.error || "Failed to save course. Please try again.");
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/role/teacher`, {
        headers: {
          ...getBrandHeaders(),
          ...getAuthHeaders(),
        },
      })
      .then((res) => {
        setTeacher(res?.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  }, []);

  const handleDeleteCourse = async () => {
    if (window.confirm("are you sure")) {
      await axios.delete(`${BASE_URL}/course/delete/${id}`, {
        headers: {
          ...getBrandHeaders(),
          ...getAuthHeaders(),
        },
      });
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

  const inputStyles = "w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors mt-1.5";
  const selectStyles = "w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors cursor-pointer mt-1.5";
  const labelStyles = "block text-sm font-medium text-slate-700";
  const sidebarCard = "bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm";
  const cardStyles = "bg-white rounded-xl shadow-sm border border-slate-100 p-5";

  return (
    <div className="min-h-screen w-full bg-slate-50/50 p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 px-2">Edit Course</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
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
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-4">
            {/* Action Bar */}
            <div className={`${sidebarCard} sticky top-4 z-10`}>
              <div className="flex gap-3">
                <button
                  onClick={() => handlePublish("final")}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteCourse()}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className={sidebarCard}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">Featured Image</h4>
              </div>
              <CommonFileUpload url={featuredImage} setUrl={setFeaturedImage} />
            </div>

            {/* Curriculum Selector */}
            <CourseCurriculumSelector
              selectedCurriculumId={curriculumId}
              setSelectedCurriculumId={setCurriculumId}
              brandKey={brandKey}
              legacyCurriculum={curriculum}
            />

            {/* Brand & Classification */}
            <div className={sidebarCard}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">Brand & Classification</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelStyles}>Brand</label>
                  <select
                    value={brandKey}
                    onChange={(e) => setBrandKey(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="muslim-school">Muslim School</option>
                    <option value="quran-care">Quran Care</option>
                    <option value="murshiid">Murshiid</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyles}>Medium</label>
                  <select
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="Record Course">Record Course</option>
                    <option value="সিঙ্গেল লাইভ ক্লাস">সিঙ্গেল লাইভ ক্লাস</option>
                    <option value="লাইভ ব্যাচ">লাইভ ব্যাচ</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyles}>Course Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className={selectStyles}
                  >
                    {allCategory.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelStyles}>Rank</label>
                  <select
                    value={courseRank}
                    onChange={(e) => setCourseRank(e.target.value)}
                    className={selectStyles}
                  >
                    {["none", "Hot", "New", "Bestseller", "Popular", "Special"].map(
                      (option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Teacher */}
            <div className={sidebarCard}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">Teacher</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <label className={labelStyles}>Assign Teacher</label>
                  <TeacherAddBox setTeacher={setTeacher} teacher={teacher} />
                </div>
                <div>
                  <label className={labelStyles}>Teacher Name</label>
                  <input
                    className={inputStyles}
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Teacher Name"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className={sidebarCard}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">Pricing</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyles}>Price</label>
                  <input
                    className={inputStyles}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Sale Price</label>
                  <input
                    className={inputStyles}
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="Sale Price"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Bangla Price</label>
                  <input
                    className={inputStyles}
                    value={banPrice}
                    onChange={(e) => setBanPrice(e.target.value)}
                    placeholder="Bangla Price"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Bangla Sale Price</label>
                  <input
                    className={inputStyles}
                    value={banSalePrice}
                    onChange={(e) => setBanSalePrice(e.target.value)}
                    placeholder="Bangla Sale Price"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Promo Code</label>
                  <input
                    className={inputStyles}
                    value={PromoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo Code"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Promo %</label>
                  <input
                    type="number"
                    className={inputStyles}
                    value={PromoPercentage}
                    onChange={(e) => setPromoPercentage(e.target.value)}
                    placeholder="Promo %"
                  />
                </div>
              </div>
            </div>

            {/* Course Details */}
            <div className={sidebarCard}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">Course Details</h4>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Student Facility
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className={labelStyles}>Total Enrolled</label>
                  <input
                    type="number"
                    className={inputStyles}
                    value={totalEnroll}
                    onChange={(e) => setTotalEnroll(e.target.value)}
                    placeholder="Total Enrolled"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Class Note</label>
                  <input
                    className={inputStyles}
                    value={classNote}
                    onChange={(e) => setClassNote(e.target.value)}
                    placeholder="Class Note"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Lecture</label>
                  <input
                    className={inputStyles}
                    value={lectures}
                    onChange={(e) => setLectures(e.target.value)}
                    placeholder="Lecture"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Duration</label>
                  <input
                    className={inputStyles}
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="Duration"
                  />
                </div>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Details Page Features
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className={labelStyles}>Total Live Class</label>
                  <input
                    type="number"
                    className={inputStyles}
                    value={totalLiveClass}
                    onChange={(e) => setTotalLiveClass(e.target.value)}
                    placeholder="Total Live Class"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Class Video Note</label>
                  <input
                    className={inputStyles}
                    value={classVideoNote}
                    onChange={(e) => setClassVideoNote(e.target.value)}
                    placeholder="Class Video Note"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Level</label>
                  <input
                    className={inputStyles}
                    value={coursedetailsLevel}
                    onChange={(e) => setCoursedetailsLevel(e.target.value)}
                    placeholder="Level"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Course Fee</label>
                  <input
                    className={inputStyles}
                    value={courseFee}
                    onChange={(e) => setCourseFee(e.target.value)}
                    placeholder="Course Fee"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyles}>Course Description</label>
                  <input
                    className={inputStyles}
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Course Description"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Course Enrolled</label>
                  <input
                    className={inputStyles}
                    value={courseEnrolled}
                    onChange={(e) => setCourseEnrolled(e.target.value)}
                    placeholder="Course Enrolled"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer transition-colors hover:bg-slate-100/70">
                <input
                  type="checkbox"
                  checked={certificate}
                  onChange={handleCertificateClick}
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span className="text-sm font-medium text-slate-700">Certificate</span>
              </label>
            </div>

            {/* Course Features */}
            <div className={sidebarCard}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">Course Features</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {renderCourseFutures()}
              </div>
            </div>

            {/* Highlighters */}
            <div className={sidebarCard}>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <div className="w-1 h-4 rounded-full bg-emerald-500"></div>
                <h4 className="text-sm font-semibold text-slate-700">Highlighters</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyles}>Course Time</label>
                  <input
                    type="text"
                    placeholder="Course Time"
                    value={courseTime}
                    onChange={(e) => setCourseTime(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Course Seat</label>
                  <input
                    type="text"
                    placeholder="Course Seat"
                    value={courseSeat}
                    onChange={(e) => setCourseSeat(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Course Day</label>
                  <input
                    type="text"
                    placeholder="Course Day"
                    value={courseDate}
                    onChange={(e) => setCourseDay(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Single Highlighter</label>
                  <input
                    type="text"
                    placeholder="Single Highlighter"
                    value={singleHighlighter}
                    onChange={(e) => setSingleHighlighter(e.target.value)}
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCourse;

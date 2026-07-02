import AddCourseTab from "@/components/AdminDashboard/AdminCourse/AddCourseTab/AddCourseTab";

import Announcement from "@/components/AdminDashboard/AdminCourse/Announcement";
import CourseDesc from "@/components/AdminDashboard/AdminCourse/CourseDesc";

import EditFAQ from "@/components/AdminDashboard/AdminCourse/UpdateFaq/EditFAQ";
import EditCuriCulumn from "@/components/AdminDashboard/AdminCourse/Update/EditCuriCulumn";
import { Separator } from "@/components/UI/separator";

const Topcolumn = ({
  inputStyles,
  cardStyles,
  courseTitle,
  setCourseTitle,
  subtitle,
  setSubtitle,
  engTitle,
  setengTitle,
  featuredVideo,
  setFeaturedVideo,
  courseDesc,
  setCourseDesc,
  curriculum,
  handleDeleteLesson,
  handleEditLesson,
  AddNewLessonFunc,
  handleDeleteModule,
  handleAddNewModule,
  faq,
  setFaq,
  pay,
  setPay,
  handleDeleteFaq,
  handleDeletePay,
  announcement,
  setAnnouncement,
  whatLearn,
  setWhatLearn,
  whatYouGet,
  setWhatYouGet,
  courseForWhom,
  setcourseForWhom,
  courseWhy,
  setcourseWhy,
  courseWhyTitle,
  setCourseWhyTitle,
  handleInputChange,
  handleDelete,
  addInputField,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        {/* Course Basic Info */}
          <input
            className={inputStyles}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Course Title"
            value={courseTitle}
          />
          <input
            className={inputStyles}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle"
            value={subtitle}
          />
          <input
            className={inputStyles}
            onChange={(e) => setengTitle(e.target.value)}
            placeholder="Eng Title"
            value={engTitle}
          />
          <input
            className={inputStyles}
            onChange={(e) => setFeaturedVideo(e.target.value)}
            placeholder="Featured Video Link"
            value={featuredVideo}
          />

          <div className="mt-6">
            <AddCourseTab
              com1={<CourseDesc savedValue={courseDesc} setValue={setCourseDesc} />}
              com3={<EditFAQ faq={faq} handleDeleteFaq={handleDeleteFaq} setFaq={setFaq} />}
              com4={<EditFAQ faq={pay} handleDeletePay={handleDeletePay} setFaq={setPay} />}
              com5={<Announcement setAnnouncement={setAnnouncement} />}
              com6={
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">What You'll Learn</h3>
                  {whatLearn?.map((value, index) => (
                    <div key={index} className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <input
                        className={inputStyles}
                        value={value.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value, setWhatLearn)
                        }
                        placeholder="Learning Point"
                      />
                      <input
                        className={inputStyles}
                        value={value.uploadUrl}
                        onChange={(e) =>
                          handleInputChange(index, "uploadUrl", e.target.value, setWhatLearn)
                        }
                        placeholder="Upload URL"
                      />
                      <button
                        className="px-4 py-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors mt-2"
                        onClick={() => handleDelete(index, setWhatLearn)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    onClick={() => addInputField(setWhatLearn, { title: "", uploadUrl: "" })}
                  >
                    Add More
                  </button>
                </div>
              }
              com7={
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">What You Get</h3>
                  {whatYouGet?.map((value, index) => (
                    <div key={index} className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <input
                        className={inputStyles}
                        value={value.uploadUrl}
                        onChange={(e) =>
                          handleInputChange(index, "uploadUrl", e.target.value, setWhatYouGet)
                        }
                        placeholder="Upload URL"
                      />
                      <input
                        className={inputStyles}
                        value={value.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value, setWhatYouGet)
                        }
                        placeholder="Title"
                      />
                      <input
                        className={inputStyles}
                        value={value.subtitle}
                        onChange={(e) =>
                          handleInputChange(index, "subtitle", e.target.value, setWhatYouGet)
                        }
                        placeholder="Subtitle"
                      />
                      <button
                        className="px-4 py-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors mt-2"
                        onClick={() => handleDelete(index, setWhatYouGet)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    onClick={() =>
                      addInputField(setWhatYouGet, { uploadUrl: "", title: "", subtitle: "" })
                    }
                  >
                    Add More
                  </button>
                </div>
              }
              com8={
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Course For Whom</h3>
                  {courseForWhom?.map((value, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        className={inputStyles}
                        value={value.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value, setcourseForWhom)
                        }
                        placeholder="Target Audience"
                      />
                      <button
                        className="px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded transition-colors text-sm font-semibold whitespace-nowrap"
                        onClick={() => handleDelete(index, setcourseForWhom)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    onClick={() => addInputField(setcourseForWhom, { title: "" })}
                  >
                    Add More
                  </button>
                </div>
              }
              com9={
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Why Choose This Course</h3>

                  <input
                    className={inputStyles}
                    value={courseWhyTitle.primaryTopTitle}
                    onChange={(e) =>
                      setCourseWhyTitle((prev) => ({
                        ...prev,
                        primaryTopTitle: e.target.value,
                      }))
                    }
                    placeholder="Primary Top Title for Course Why"
                  />

                  <input
                    className={inputStyles}
                    value={courseWhyTitle.secondaryTopTitle}
                    onChange={(e) =>
                      setCourseWhyTitle((prev) => ({
                        ...prev,
                        secondaryTopTitle: e.target.value,
                      }))
                    }
                    placeholder="Secondary Top Title for Course Why"
                  />

                  <div>
                    <Separator className="h-7 bg-amber-500" />
                  </div>

                  {courseWhy?.map((value, index) => (
                    <div key={index} className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <label className="font-semibold text-slate-700 text-xs">Course why details</label>
                      <input
                        className={inputStyles}
                        value={value.uploadUrl}
                        onChange={(e) =>
                          handleInputChange(index, "uploadUrl", e.target.value, setcourseWhy)
                        }
                        placeholder="Upload URL"
                      />
                      <input
                        className={inputStyles}
                        value={value.title}
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value, setcourseWhy)
                        }
                        placeholder="Title"
                      />
                      <input
                        className={inputStyles}
                        value={value.subtitle}
                        onChange={(e) =>
                          handleInputChange(index, "subtitle", e.target.value, setcourseWhy)
                        }
                        placeholder="Subtitle"
                      />
                      <select
                        className="w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors cursor-pointer mt-1.5"
                        value={value.layout}
                        onChange={(e) =>
                          handleInputChange(index, "layout", e.target.value, setcourseWhy)
                        }
                      >
                        <option value="">Select Layout Direction</option>
                        <option value="row">Row</option>
                        <option value="row-reverse">Row Reverse</option>
                      </select>
                      <button
                        className="px-4 py-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded text-sm font-semibold transition-colors mt-2"
                        onClick={() => handleDelete(index, setcourseWhy)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    onClick={() =>
                      addInputField(setcourseWhy, {
                        uploadUrl: "",
                        title: "",
                        subtitle: "",
                        layout: "",
                      })
                    }
                  >
                    Add More
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </div>
  );
};

export default Topcolumn;

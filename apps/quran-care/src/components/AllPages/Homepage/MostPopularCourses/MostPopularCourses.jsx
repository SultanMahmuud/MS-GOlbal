
import FamousBar from './FamousBar';
import CommonCourse from './CommonCourse';



const MostPopularCoursesPage = async() => {
 

  return (
    <div className="bg-white py-8 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex flex-col items-center">
          <p className="inline-block text-sm font-bold bg-[rgb(239_243_241/80%)] text-primary rounded px-4 py-2">
            ২৫,০০০+  বেশি লাইভ ক্লাসে অংশগ্রহণ করেছেন
          </p>
          <h2 className="text-[26px] md:text-3xl font-bold lg:font-extrabold base1 my-4">
           আমাদের সবচেয়ে <br className='block lg:hidden'/> জনপ্রিয় কোর্সসমূহ
          </h2>
          <FamousBar />
        </div>
      <CommonCourse />

      </div>
    </div>
  );
}
export default MostPopularCoursesPage;
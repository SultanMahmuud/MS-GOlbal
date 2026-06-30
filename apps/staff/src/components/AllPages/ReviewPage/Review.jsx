
import ReviewCard from "./ReviewCard"

export default function Review() {

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-hind">
          Testimonials
        </h2>
        <p className="text-base sm:text-lg  font-semibold mt-2 tracking-wide">
          “What Students & Parents Are Saying About Us”
        </p>
        <p className="text-sm sm:text-base font-semibold mt-2 tracking-wide">
          We take every feedback of students and parents very seriously.
          Accordingly, we strive to improve <br className="hidden sm:block" />
          our operations more and more. You can also share your opinion about us
        </p>
      </div>
<ReviewCard showPage={"ReviewPage"}/>
      
      
    </div>
  );
}

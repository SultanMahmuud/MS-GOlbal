// components/StarRating.jsx
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { RatingCal } from "./RatingCalc";


const StarRating = ({ reviews }) => {
  const rating = RatingCal(reviews);
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-orange-300 w-[18px] h-[18px]" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-orange-300" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-400 w-[18px] h-[18px]" />);
  }

  return (
    <div className="flex items-center gap-1 mb-2">
      {stars}
      <span className="text-sm text-gray-600 ml-2">({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;

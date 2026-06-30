import React from 'react';

interface TimeAgoProps {
    date: string; // ISO date string (e.g., '2024-07-14T00:00:00Z')
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date }) => {
    // Function to calculate the relative time
    const getTimeAgo = (date: string) => {
        const presentDate = new Date();
        const postedDate = new Date(date);
        const diffInMs = presentDate.getTime() - postedDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);
        if (diffInYears > 0) {
            return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
        } else if (diffInMonths > 0) {
            return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
        } else if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return 'Today';
        }
    };

    return <span className='text-gray-600 text-xs sm:text-sm'>Reviewed {getTimeAgo(date)}</span>;
};

export default TimeAgo;

import React from 'react'
import CourseDetails from './CourseDetails/CourseDetails'

const CourseDetailsMain = ({courseID}) => {
  return (
    <div>
      <CourseDetails courseID ={courseID}
      />
    </div>
  )
}

export default CourseDetailsMain

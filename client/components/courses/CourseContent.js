import React from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios'
import CourseCard from '../cards/CourseCard'


const CourseContent = () => {
   const [courses,setCourses] = useState([])

   //Rendering Courses using the fetch Courses Function
   useEffect(()=>{
     const fetchCourses =async()=>{
       const {data} = await axios.get('/api/courses')
       setCourses(data)
     }
     fetchCourses()
   },[])

  return (
      <>
     <main id="main" data-aos="fade-in">

<div className="breadcrumbs p-5">
  <div className="container">
    <h1 className="text-light" style={{fontSize:'45px',color:'green'}}>OUR COURSES</h1>

    <p className="text-light" style={{fontSize:'25px',fontFamily:'Raleway'}}>We offer free courses and tutorials at reasonable costs.Most of the courses are free but a for a few we charge a reasonable fee.Edemy has the best courses curated by professional programmers who have inculcated their experience.</p>
  </div>
</div>

<section id="courses" className="courses">
  <div className="container" data-aos="fade-up">

    <div className="row" data-aos="zoom-in" data-aos-delay="100">

      <div className="row">
        {courses.map((course)=>
        <div key={course._id} className="col-md-4">
          <CourseCard course = {course} />
        </div>)}
      </div>


     

    </div>
  </div>
</section>

</main>


      </>
  )
}

export default CourseContent
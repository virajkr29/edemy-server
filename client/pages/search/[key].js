import React from "react";
import { useState,useEffect } from "react";
import {useRouter} from "next/router";
import {toast} from 'react-toastify'
import axios from "axios";
import CourseCard from "../../components/cards/CourseCard";
import { Context } from "../../context";

const Search = () =>{

    const router = useRouter();
    const { key } = router.query;

    const [loading,setLoading] = useState(false)
    const [courses,setCourses] = useState([])

    useEffect(()=>{
        const fetchCourses =async()=>{
            try{
            const {data} = await axios.get(`/api/course/search/${key}`)
            if(data){
              setCourses(data)
              toast("Courses Found !")
            }else{
              toast("No Courses Found Please Try Again!")
            }

            }catch(err){
               console.log(err) 
               toast(err)
            }
          }
        fetchCourses()
      },[key])

    return (
        <>
            <h1 className=" text-center bg-success jumbotron-success square">Search Results</h1>

            {/* <pre>{JSON.stringify(courses,null,4)}</pre> */}

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
        </>
    )
}

export default Search;
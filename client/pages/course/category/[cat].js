import { useState,useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import CourseCard from '../../../components/cards/CourseCard'
import FooterSection from '../../../components/footer/FooterSection'

const CourseCategory = () =>{
    let router = useRouter()
    let {cat} = router.query
    console.log(cat)
    const [courses,setCourses] = useState([])

    //Rendering Courses using the fetch Courses Function
    useEffect(()=>{
      const fetchCourses =async()=>{
        const {data} = await axios.get(`/api/courses/category/${cat}`)
        setCourses(data)
      }
      fetchCourses()
    },[cat])

    console.log(courses)

    return (
        <>
            <h1 className=" text-center bg-success jumbotron-success square">{cat}</h1>
           <div className="container">
           <div className="row">

{courses.length ? courses.map((course)=>
<div key={course._id} className="col-md-3">
   <CourseCard course = {course} />
</div>) :(<h3>Sorry No Courses in this Category !</h3>)}

</div>
<div className="spacer-500"></div>
           </div>
            {/* <pre>{JSON.stringify(courses,null,4)}</pre> */}
            <FooterSection />
        </>
    )
}

export default CourseCategory;
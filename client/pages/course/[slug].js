import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import FooterSection from '../../components/footer/FooterSection';
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron';
import PreviewModal from '../../components/modals/PreviewModal';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { Context } from '../../context/';
import {toast} from 'react-toastify'
import {loadStripe} from '@stripe/stripe-js'

const SingleCourse = ({ course }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  const [loading,setLoading] = useState(false)
  const [enrolled,setEnrolled] = useState({})

  //Passing the user as an argument as seen here
  const {
    state: {user}} = useContext(Context)
  console.log("USER DATA IN CLIENT",user)


  useEffect(()=>{
    if(user && course) checkEnrollment()
  },[user,course])

  const checkEnrollment = async()=>{
    const {data} = await axios.get(`/api/check-enrollment/${course._id}`)
    console.log("CHECK ENROLLMENT",data)
     setEnrolled(data)

  }

  //Check if the user is already enrolled in the course
  const handlePaidEnrollment = async() =>{
      console.log("Handle Paid Enrollment")

      try{
        //Check if user is logged in
      if(!user) {
        router.push('/login')
      }

      if(enrolled.status){
        return router.push(`/user/course/${enrolled.course.slug}`)
      }

      const {data} = await axios.post(`/api/paid-enrollment/${course._id}`)
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
    
      stripe.redirectToCheckout({sessionId: data})
      setLoading(false)
      }catch(err){
        toast("Enrollment Failed,Try Again")
        console.log(err)
        setLoading(false)
      }
  }


  //Here we are going to create a course for free enrollment as we can see here
  const handleFreeEnrollment = async(e) =>{
    console.log("Handle Free Enrollment")

    e.preventDefault()

    try{
      //Check if user is logged in
      if(!user) {
        router.push('/login')
      }

      if(enrolled.status){
        return router.push(`/user/course/${enrolled.course.slug}`)
      }
      
      setLoading(true)

      //check if already enrolled
      const {data} = await axios.post(`/api/free-enrollment/${course._id}`)
      toast(data.message)
      setLoading(false)
      router.push(`/user/course/${enrolled.course.slug}`)

    }catch(err){
      toast("Enrollment Failed ! Please Try Again !")
      console.log(err)
      setLoading(false)
    }
}

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment = {handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled = {setEnrolled}
      />
      
      {/* If one of the lessons has free preview we will enable them too */}
      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}

      <FooterSection />

      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />

    </>
  );
};

export async function getServerSideProps({ query }) {
  console.log('QUERY==>', query);
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);

  return {
    props: {
      course: data,
    },
  };
}
export default SingleCourse;

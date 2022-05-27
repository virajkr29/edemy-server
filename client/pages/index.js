import UserRoute from "../components/routes/UserRoute";
import HeroSection from "../components/hero/HeroSection";
import FeatureSection from "../components/features/FeatureSection"
import FooterSection from "../components/footer/FooterSection";
import Image from "next/image"
import CourseContent from "../components/courses/CourseContent";
import axios from "axios";

const Index = () =>{


    return (
        <>
                    <HeroSection />
                    <FeatureSection />
                    <CourseContent />
                    <FooterSection />


        </>
    )
}

export async function getServerSideProps(){
    const {data} = await axios.get(`${process.env.API}/courses`);

    return {
        props:{
            courses:data
        }
    }
}

export default Index;
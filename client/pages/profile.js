import {useContext} from 'react'
import UserRoute from "../components/routes/UserRoute"
import FooterSection from '../components/footer/FooterSection'


const Instructor = () =>{
    //state for the page

    return (
        <>
        <UserRoute>
        <h1 className='jumbotron text-center square'>
                User Profile
            </h1> 
            <div className="spacer">
                
            </div>
        </UserRoute>
        <FooterSection />

        </>
       

    )
}

export default Instructor;
import {useContext} from 'react'
import { Context } from '../../context'
import UserRoute from "../../components/routes/UserRoute"
import FooterSection from '../../components/footer/FooterSection'


const Instructor = () =>{
    //state for the page

    const {
        state: {user},
    } = useContext(Context)

    return (
        <>
        <UserRoute>
        <h1 className='jumbotron text-center square'>
                Create Course : Instructor 
            </h1> 
            <div className="spacer">
                
            </div>
        </UserRoute>
        <FooterSection />

        </>
       

    )
}

export default Instructor;
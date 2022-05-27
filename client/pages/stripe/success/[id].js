import { useEffect } from "react";
import { SyncOutlined} from "@ant-design/icons";
import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";

const StripeSuccess = ()=>{

    const router = useRouter()
    const {id} = router.query
    
    useEffect(()=>{
       if(id) successRequest()

    },[id])

    const successRequest = async()=>{
        const {data} = await axios.get(`/api/stripe-success/${id}`)

         //console.log("COURSE DATA ===>",data)
        // console.log("COURSE SLUG :====>>>",data.course.slug)
        router.push(`/user/course/${data.course.slug}`)
    }

    return (
        <UserRoute showNav={false}>
            <div className="row text-center">
                <div className="col-md-9">
                    <div className="display-flex justify-content-center p-5">
                          <SyncOutlined spin className='display-1 text-success p-5' />
                          <h3>You Are Being Redirected. Please Wait....</h3>
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </UserRoute>
    )


}

export default StripeSuccess
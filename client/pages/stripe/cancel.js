import {CloudSyncOutlined } from '@ant-design/icons'
import UserRoute from '../../components/routes/UserRoute'


const StripeCancel =()=>{


    return (
        <UserRoute showNav={false}>
            <div className="row text-center">
                <div className="col">
                    <CloudSyncOutlined style={{fontSize:"200px"}} className='display-1 text-danger p-4' />
                    <p className='display-4'> Unable to Process Transaction ....</p>
                    <p className='display-5'> Please Try Again Later. </p>
                    <p className='' style={{fontSize:"30px"}}>You have either aborted the transaction or the transaction was not successfully completed
 </p>



                </div>
              <div className="col-md-3"></div>
            </div>
        </UserRoute>
    )
}

export default StripeCancel


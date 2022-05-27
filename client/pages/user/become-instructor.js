import axios from 'axios';
import { useContext, useState } from 'react';
import { Button } from 'antd';
import {
  SettingOutlined,
  UserSwitchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import userRoute from '../../components/routes/UserRoute';
import { Context } from '../../context';

const BecomeInstructor = () => {
  const [loading, setLoading] = useState(false);
  const {
    state: { user },
  } = useContext(Context);

  const becomeInstructor=()=>{
           // console.log("Become Instructor")

           setLoading(true)
           axios.post('/api/make-instructor')
           .then((res)=>{
             console.log(res)
             window.location.href = res.data
           })
           .catch((err)=>{
             console.log(err.response.status)
             toast('Stripe Onboarding Failed ! Try Again !')
             setLoading(false)
           })

  }


  return (
    <>
      <h1 className='jumbotron text-center square'>Become Instructor</h1>
      <div className='container'>
        <div className='col-md-6 offset-md-3 text-center'>
          <UserSwitchOutlined className='display-1 pb-3' />
          <br />
          <h1>Setup Payout to publish course on Edemy Marketplace</h1>
          <p className=' text-danger h4'>
            Edemy Partners with stripe to transfer earning to your bank account
          </p>
           <br/>
          <Button
            className='mb-3'
            type='primary'
            block
            shape='round'
            icon={loading ? <LoadingOutlined /> : <SettingOutlined />}
            size='large'
            onClick={becomeInstructor}
            disabled = {user && user.role && user.role.includes("Instructor")|| loading}
          >{loading ? "Processing...": "Payout Setup"}</Button>

          <br />
          <p className='lead'>
            You will be redirected to stripe to complete the onboarding
            process.....
          </p>
        </div>
      </div>
    </>
  );
};

export default BecomeInstructor;

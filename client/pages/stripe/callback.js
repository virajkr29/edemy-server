import {useContext,useEffect} from 'react'
import { Context } from '../../context/index'
import {SyncOutlined} from '@ant-design/icons'
import UserRoute from '../../components/routes/UserRoute'
import axios from 'axios'


const StripeCallback = ()=>{
    const {state: {user}}=useContext(Context)


    useEffect(()=>{
        if(user){
            axios.post('/api/get-account-status').then((res)=>{
                console.log(res)
               // window.location.href="/instructor"
            })
        }
    },[user])

    return (
        //Show the sidebar
        <SyncOutlined spin className='d-flex justify-content-center display-1 text-danger p-5' />
    )

}

export default StripeCallback


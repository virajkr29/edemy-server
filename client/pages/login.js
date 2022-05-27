import {useState,useContext,useEffect} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
import { Context } from '../context'
import {useRouter} from 'next/router'

const Login = () =>{
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)

    //state access will be here
    const {state,dispatch} = useContext(Context)
    const {user} = state

    const router = useRouter()

    useEffect(()=>{
        if(user != null) router.push('/')

    },[user])


    console.log("STATE",state)

    const handleSubmit = async(e) =>{
        //To prevent the page reload while the form is submitted
        e.preventDefault();
        
      //  console.table({email,password})

        try{
            setLoading(true)
            const {data} = await axios.post(`api/login`,{email,password})

        console.log('Login Request', data)
        dispatch({
            type:"LOGIN",
            payload: data,
        })
        //Saving Data  data in the local storage 

        window.localStorage.setItem('user', JSON.stringify(data))

        //Redirecting Data Here 
        router.push("/user")

        toast.success("Login Successful. Please Login")
       
        //setLoading(false)
        }catch(err){
            toast.error(err.response.data);
            setLoading(false)

        }
    }
    return (
        <>
            <h1 className=" text-center bg-primary jumbotron square">LOGIN PAGE</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>

         <input type="email" className="form-control mb-4 p-4"
                     value={email}
                     onChange={(e)=>setEmail(e.target.value)} 
                     placeholder="Enter Email"
                     required
                     />

         <input type="password" className="form-control mb-4 p-4"
                     value={password}
                     onChange={(e)=>setPassword(e.target.value)} 
                     placeholder="Enter Password"
                     required
                     />

                     <button className="btn btn-lg  btn-center col-12  btn-primary " disabled={ !email || !password|| loading} >{loading ? <SyncOutlined spin /> : "SUBMIT" }</button>
                </form>
                <h5 className="text-center p-3">
                    Do not have an Account ? 
                    <Link href="/register"> Register</Link>
                </h5>

                <h5 className="text-center text-danger">
                    Forgot Password ? 
                    <Link href="/forgot-password"><a> Click Here</a></Link>
                </h5>
            </div>
        </>
    )
}

export default Login;
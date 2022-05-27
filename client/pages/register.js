import {useState,useEffect,useContext} from 'react'
import axios from 'axios'
import {toast} from 'react-toastify'
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
import  {Context} from "../context"
import { useRouter } from 'next/router'
import user from '../../server/models/userModel'

const Register = () =>{
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)

    const {state:{user},} = useContext(Context)

    const router = useRouter()

    useEffect(()=>{
        if(user !==null) router.push("/")

    },[user])


    const handleSubmit = async(e) =>{
        //To prevent the page reload while the form is submitted
        e.preventDefault();
        
        console.table({name,email,password})

        try{
            setLoading(true)
            const {data} = await axios.post(`api/register`,{name,email,password})

        console.log('Registering the request', data)
        toast.success("Registeration Successful. Please Login")
        setLoading(false)
        }catch(err){
            toast.error(err.response.data);
            setLoading(false)

        }
    }
    return (
        <>
            <h1 className=" text-center bg-primary jumbotron square">REGISTER PAGE</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>

            <input type="text" className="form-control mb-4 p-4"
                     value={name}
                     onChange={(e)=>setName(e.target.value)} 
                     placeholder="Enter Name"
                     required
                     />

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

                     <button className="btn btn-lg  btn-center  btn-primary " disabled={!name || !email || !password|| loading} >{loading ? <SyncOutlined spin /> : "SUBMIT" }</button>
                </form>
                <h5 className="text-center p-3">
                    Alread Registered ? 
                    <Link href="/login"> Login</Link>
                </h5>
            </div>
        </>
    )
}

export default Register;
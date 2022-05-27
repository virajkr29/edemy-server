import {Menu} from 'antd';
import Link from 'next/link';
import {AppstoreOutlined,LoginOutlined,UserAddOutlined,CopyOutlined, LogoutOutlined, CoffeeOutlined,CarryOutOutlined,TeamOutlined} from '@ant-design/icons';
import {useState,useEffect,useContext} from 'react'

import {Context} from "../context"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import "bootstrap/dist/css/bootstrap.min.css"



const {Item,SubMenu,ItemGroup} = Menu;

const TopNav = () =>{
    const [current,setCurrent] = useState("")

    const {state,dispatch} = useContext(Context)

    const {user} = state;

    const router = useRouter()

    useEffect(()=>{
       process.browser && setCurrent(window.location.pathname)
    },[process.browser && window.location.pathname])

    const logout = async()=>{
        dispatch({type:"LOGOUT"})
        window.localStorage.removeItem("user")
        const {data} = await axios.get("/api/logout")
        toast(data.message)
        router.push('/login')

    }
   
    return (
        <Menu mode="horizontal" className='d-flex justify-content-center' selectedKeys={[current]}>
            <Item key="/" onClick={e=> setCurrent(e.key)} icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a className="type">App</a>
                </Link>
            </Item>

            {user && (
                <Item key="/admin/admin-panel" onClick={e=> setCurrent(e.key)} icon={<AppstoreOutlined />}>
                <Link href="/admin/admin-panel">
                    <a className="type">Admin Dashboard</a>
                </Link>
            </Item>

            
            )}

            {user && user.role && (
                <Item key="/admin/admin-courses" onClick={e=> setCurrent(e.key)} icon={<CarryOutOutlined />}>
                <Link href="/admin/admin-courses">
                    <a className="type">Courses</a>
                </Link>
            </Item>
            )}

           
            <Item key="/admin/admin-users" onClick={e=> setCurrent(e.key)} icon={<CopyOutlined />}>
                <Link href="/admin/admin-users" target="_blank">
                    <a className="type" target="_blank">Users</a>
                </Link>
            </Item>

        </Menu>

    );
};

export default TopNav;
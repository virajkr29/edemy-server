import {Menu} from 'antd';
import Link from 'next/link';
import {AppstoreOutlined,LoginOutlined,UserAddOutlined,CopyOutlined, LogoutOutlined, CoffeeOutlined,CarryOutOutlined,TeamOutlined} from '@ant-design/icons';
import {useState,useEffect,useContext} from 'react'

import {Context} from "../context"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import "bootstrap/dist/css/bootstrap.min.css"
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
const { Search } = Input;

const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );

const {Item,SubMenu,ItemGroup} = Menu;

const TopNav = () =>{
    const [current,setCurrent] = useState("")

    const [key,setKey] = useState("")

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

    const handleSearch = (key)=>{
        try{
            if(key){
                console.log(key)
            setKey(key)
            router.push(`/search/${key}`)
            }else{
                return
            }
            

        }catch(err){
            console.log(err)
        }
    }
   
    return (
        <Menu mode="horizontal" selectedKeys={[current]}>
            <Item key="/" onClick={e=> setCurrent(e.key)} icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a className="type">App</a>
                </Link>
            </Item>

            {user && (
                <Item key="/user" onClick={e=> setCurrent(e.key)} icon={<AppstoreOutlined />}>
                <Link href="/user">
                    <a className="type">Dashboard</a>
                </Link>
            </Item>

            
            )}

            {user && user.role && (
                <Item key="/instructor/course/create" onClick={e=> setCurrent(e.key)} icon={<CarryOutOutlined />}>
                <Link href="/instructor/course/create">
                    <a className="type">Create Course</a>
                </Link>
            </Item>
            )}

            {user && user.role.find(r=> r==="Admin") && (
                <Item key="/admin/admin-panel" onClick={e=> setCurrent(e.key)} icon={<CarryOutOutlined />}>
                <Link href="/admin/admin-panel">
                    <a className="type">Admin</a>
                </Link>
            </Item>
            )} 


            {user===null &&(
                <>
                   <Item key="/login" onClick={e=> setCurrent(e.key)} icon={<LoginOutlined />}>
                <Link href="/login">
                    <a className="type">Login</a>
                </Link>
            </Item>

            <Item key="/register" onClick={e=> setCurrent(e.key)} icon={<UserAddOutlined />}>
                <Link href="/register">
                    <a className="type">Register</a>
                </Link>
            </Item>
                </>

            )}
           
            <Item key="/blog" onClick={e=> setCurrent(e.key)} icon={<CopyOutlined />}>
                <Link href="/blog" target="_blank">
                    <a className="type" target="_blank">Blog</a>
                </Link>
            </Item>

            <Item key="/community" onClick={e=> setCurrent(e.key)} icon={<CopyOutlined />}>
                <Link href="/community" target="_blank">
                    <a className="type" target="_blank">Our Community</a>
                </Link>
            </Item>

            <Item key="/contact" onClick={e=> setCurrent(e.key)} icon={<CopyOutlined />}>
                <Link href="/contact" >
                    <a className="type">Contact Us</a>
                </Link>
            </Item>

            <Item style={{marginLeft:'200px',marginTop:'5px'}}>
            <Search
                        className='me-auto'
                        placeholder="Search Courses"
                        allowClear
                        size='large'
                        enterButton="Search"
                        onSearch={handleSearch}
                        style={{
                            width: 300,
                          }}
                        />

            </Item>                        

            {user != null && (
                <SubMenu icon={<CoffeeOutlined />} title={user &&user.name} className="ms-auto">
                    
            <ItemGroup>
                <Item key="/user">
                    <Link href="/user">
                        <a>Dashboard
                            </a>
                            </Link>
                </Item>
                <Item onClick={logout} icon={<LoginOutlined />} className="">
                     Logout
                </Item>
            </ItemGroup>

                </SubMenu>
            )}

        </Menu>

    );
};

export default TopNav;
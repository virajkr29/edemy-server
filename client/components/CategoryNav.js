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

const CategoryNav = () =>{

  let category = ["web-dev","web-design","programming-funda","data-structures","cse-fundas","video-editing","graphics-design"]

    const router = useRouter()

    return (

        <Menu mode="horizontal" className='d-flex justify-content-center'>
              {
                  category.map(cat=>(
                    <Item key={cat} icon={<AppstoreOutlined />}>
                    <Link href={`/course/category/${cat}`}>
                        <a className="type">{cat.replace("-"," ").toUpperCase()}</a>
                    </Link>
                </Item> 
                  ))
              }

                  
                     
                
           
            

            
        </Menu>

    );
};

/*
  <Item key="/" icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a className="type">Data Structures </a>
                </Link>
            </Item>

            <Item key="/" icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a className="type">Programming Fundamentals</a>
                </Link>
            </Item>

            <Item key="/" icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a className="type">Computer Science Fundamentals</a>
                </Link>
            </Item>

            <Item key="/" icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a className="type">Graphics Design</a>
                </Link>
            </Item>

            <Item key="/" icon={<AppstoreOutlined />}>
                <Link href="/">
                    <a className="type">Video Editing</a>
                </Link>
            </Item>
           

*/

export default CategoryNav;
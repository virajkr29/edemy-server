import TopNav from '../components/TopNav'
import CategoryNav from '../components/CategoryNav'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import '../public/vendor/animate/animate.min.css'
import '../public/vendor/boxicons/css/boxicons.min.css'
import '../public/vendor/remixicon/remixicon.css'
import '../public/vendor/swiper/swiper-bundle.min.css'
import { useContext } from 'react'


import '../public/css/style.css'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Provider} from "../context"
import Head from 'next/head'

const MyApp = ({Component,pageProps})=>{
    

    return(
        <>
        <Head>
        <title>Edemy Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
        </Head>

        <Provider>
        {/* Here we are specifying the toast to show the messages as seen here */}
        <ToastContainer position='top-center'/>
        <TopNav />
        <CategoryNav />
         <Component {...pageProps} />
         </Provider>
        </>
    );
}
export default MyApp;
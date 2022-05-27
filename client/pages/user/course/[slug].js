import { useState, useEffect,createElement } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import StudentRoute from '../../../components/routes/StudentRoute';
import { Button, Menu, Avatar } from 'antd';
const { Item } = Menu;
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import { PlayCircleOutlined,MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons';
import FooterSection from '../../../components/footer/FooterSection';

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] }); //You wont have access to the lessons so it may cause error

  //Router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    //loadcourse will take care of loading the course as we can see here
    if (slug) loadCourse();
    
  }, [slug]);

  const loadCourse = async () => {
    //Apply the middleware to access the course if the user is logged in and has access to the course
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };
  return (
    <>
      <StudentRoute>
        <div className='row'>
          <h1 className='py-3 px-3'>{course.name}</h1>

          <div className='col-md-4' style={{ maxWidth: 320 }}>
              <Button onClick={()=>setCollapsed(!collapsed)} className='text-primary mt-1 btn-block mb-2'>
                  {
                      createElement(collapsed ? MenuFoldOutlined : MenuFoldOutlined)
                  }

                  {" "}

                  {!collapsed && "Lessons"}
              </Button>
            <Menu
              defaultSelectedKeys={[clicked]}
              inlineCollapsed={collapsed}
              style={{ height: '85vh', overflow: 'scroll' }}
            >
              {course.lessons.map((lesson, index) => (
                <Menu.Item
                  onClick={() => setClicked(index)}
                  key={index}
                  icon={<Avatar>{index + 1}</Avatar>}
                >
                  {lesson.title}
                </Menu.Item>
              ))}
            </Menu>
          </div>
          <div className='col-md-8  pl-5'>
            {clicked !== -1 ? (
              // If we have video we will show it otherwise we wont
              <>
                {course.lessons[clicked].video &&
                  course.lessons[clicked].video.Location && (

                      <div className='wrapper'>
                        <ReactPlayer
                          className='player'
                          url={course.lessons[clicked].video.Location}
                          width='100%'
                          height='100%'
                          controls
                        />
                      </div>
                  )}
                  {
                   course.lessons[clicked]&&course.lessons[clicked].embed && (
                    <div className='wrapper'>
                      <h2 className='pt-4'>Embeded Classroom Lectures :</h2>                  
                        <ReactPlayer
                          className='player'
                          url={course.lessons[clicked].embed}
                          width='960px'
                          height='480px'
                          controls
                        />
                      </div>                   
                    )
                  }
                <h2 className='pt-5'>Tutorial :</h2>

                <ReactMarkdown
                  children={course.lessons[clicked].content}
                  className='single-post'
                />
              </>
            ) : (
              <>
                <div className='d-flex justify-content-center p-5'>
                  <div className='text-center p-5'>
                    <PlayCircleOutlined className='text-primary display-1 p-5' />
                    <h3>Click on the Lesson to Start Learning </h3>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </StudentRoute>
      <div className="spacer-200"></div>
      <FooterSection />
    </>
  );
};

export default SingleCourse;

/*

{
                  course.lessons[clicked].video && course.lessons[clicked].video.location && (
                      <>
                         <div className='wrapper'>
                             <ReactPlayer 
                              className="player"
                              url={course[clicked].video.Location}
                              width="480px"
                              controls
                             />
                         </div>

                         <ReactMarkdown source={course.lessons[clicked].content} 
                          className="single-post"
                         />
                      </>
                  )
              }
*/

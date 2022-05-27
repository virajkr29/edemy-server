import { useContext, useState, useEffect } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import FooterSection from '../../components/footer/FooterSection';
import axios from 'axios';
import { Avatar,Tooltip } from 'antd';
import Link from 'next/link';
import { CheckCircleFilled, CloseCircleOutlined,SyncOutlined,PlayCircleFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';

const UserIndex = () => {
  //state for the page
  const [courses, setCourses] = useState([]);
  const [userCourses,setUserCourses] = useState([])
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    loadCourses();
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async() =>{
    try{
      setLoading(true)
      const {data} = await axios.get('/api/user-courses')
    setUserCourses(data)
    setLoading(false)
    }catch(err){
      console.log(err)
    }

  }

  const loadCourses = async () => {
    
    try{
      const { data } = await axios.get(`/api/instructor-courses`);
    setCourses(data);
    
    toast("Courses Fetched Successfully !")
    }catch(err){
      console.log(err)
      toast("Unable to Fetch Courses")
    }
  
  };
const myStyle = {
    marginTop: "-15px",
    fontSize: "12px"
}
  return (
    <>
      <UserRoute>
        <h1 className='jumbotron text-center square'>User Dashboard</h1>
        <div>
          { /* <pre>{JSON.stringify(courses,null,4)}</pre>*/ }
          <h3 className="text-center">Created Courses</h3>


          {courses &&
            courses.map((course) => (
              <>
                  <div className='media-body pl-2'>
                    <div className='row'>
                        <div className="col-md-2">
                        <div className='media pt-2'>
                  <Avatar
                    size={80}
                    src={course.image ? course.image.Location : 'course.jpg'}
                  />
                  </div>
                        </div>
                      <div className='col-md-8'>
                        <Link
                          href={`/instructor/course/view/${course.slug}`}
                          className='pointer'
                        >
                          <a className='h5 mt-2 text-priamry pt-2'>{course.name}</a>
                        </Link>
                        <p style={{ marginTop: '-10px' }}>
                          {course.lessons.length} Lessons
                        </p>

                        {course.lessons.length < 5 ? (
                          <p style={myStyle} className="text-warning">
                            At Least 5 Lessons are required to publish a course{' '}
                          </p>
                        ) : course.published ? (
                          <p style={myStyle} className="text-success">Your Course is Live in the Marketplace</p>
                        ) : (
                          <p style={myStyle} className="text-success">Your Course is ready to be published</p>
                        )}
                      </div>
                      <div className='col-md-2 mt-3 text-center '>
                        {course.published ? (
                          <Tooltip title="Published">
                            <CheckCircleFilled className='h5 pointer text-success' />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Unpublished">
                            <CloseCircleOutlined className='h5 pointer text-danger' />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
        
              </>
            ))}
        </div>
        <div>
        

        {
          loading && <SyncOutlined spin className='d-flex justify-content-center display-1 text-danger p-5' />
        }

        {/* Show List of All the courses :: */}
                          
        <h3 className="text-center">Enrolled Courses</h3>
        {/* <pre>{JSON.stringify(userCourses,null,4)}</pre> */}
        <p>All of your learnings are present here</p>

        {userCourses && userCourses.map((usercourse)=>
              (
                <>


                <div className='media-body pl-2'>
                  <div className="row">
                  <div key={usercourse._id} className='col-md-2 media pt-2 pb-1'>
                  <Avatar size={80} shape="circle" src={usercourse.image ? usercourse.image.Location : "course.jpg"} />
                </div>

                    <div className="col">
                      <Link href={`/user/course/${usercourse.slug}`} className="pointer">
                        <a href=""> <h5>{usercourse.name}</h5></a>
                      </Link>
                      <p style={{marginTop: '-10px'}}>{usercourse.lessons.length} Lessons</p>
                      <p className='text-muted' style={{marginTop:'-15px',fontSize:'-12px'}}>
                        By {usercourse.instructor.name}
                      </p>
                    </div>
                    
                    <div className="col-md-3 mt-3 text-center">
                      <Link href={`user/course/${usercourse.slug}`} className="pointer">
                        <a><PlayCircleFilled className="h1 pointer text-primary" /></a>
                      </Link>

                    </div>
                  </div>
                </div>
                </>

                
              )
        )}



        </div>
      </UserRoute>
      <div className='spacer-500' />
      <FooterSection />
    </>
  );
};

export default UserIndex;

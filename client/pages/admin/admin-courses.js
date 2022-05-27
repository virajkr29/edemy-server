import { useContext, useState, useEffect } from 'react';
import { Context } from '../../context/index';
import UserRoute from '../../components/routes/UserRoute';
import FooterSection from '../../components/footer/FooterSection';
import AdminNav from '../../components/AdminNav'
import axios from 'axios';
import { Avatar,Tooltip } from 'antd';
import Link from 'next/link';
import { CheckCircleFilled, CloseCircleOutlined,SyncOutlined,PlayCircleFilled, DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const AdminCourses = () => {
  //state for the page
  const [courses, setCourses] = useState([]);
  const [userCourses,setUserCourses] = useState([])
  const [loading,setLoading] = useState(false)

  const {state,dispatch} = useContext(Context)
    const {user} = state;

  useEffect(() => {
    loadCourses();
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async() =>{
    try{
      setLoading(true)
      const {data} = await axios.get('/api/admin-courses')
    setUserCourses(data)
    setLoading(false)
    }catch(err){
      console.log(err)
    }

  }

  const loadCourses = async () => {
    
    try{
      const { data } = await axios.get(`/api/admin-courses`);
    setCourses(data);
    
    toast("Courses Fetched Successfully !")
    }catch(err){
      console.log(err)
      toast("Unable to Fetch Courses")
    }
  
  };

  const handleDeleteCourse = async() =>{
      try{

      }catch(err){
          toast("Course Deletion Failed !")
      }
  }
const myStyle = {
    marginTop: "-15px",
    fontSize: "12px"
}
  return (
    <>
    
      <UserRoute>
      {
            user && user.role.find(r=> r==="Admin") && (
                <AdminNav />
            )
        }
        <h1 className='jumbotron text-center square'>Admin Courses</h1>
        <h3 className="text-center">Created Courses</h3>
        <div>
          { /* <pre>{JSON.stringify(courses,null,4)}</pre>*/ }

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
                        <p style={{ marginTop: '-5px' }}>
                          {course.lessons.length} Lessons
                        </p>
                        <p style={{ marginTop: '-20px',fontSize: '14px' }}>
                          {course.instructor.name}
                        </p>

                        {course.lessons.length < 5 ? (
                          <p style={myStyle} className="text-warning">
                            At Least 5 Lessons are required to publish a course{' '}
                          </p>
                        ) : course.published ? (
                          <p style={myStyle} className="text-success pb-2">Your Course is Live in the Marketplace</p>
                        ) : (
                          <p style={myStyle} className="text-success pb-2">Your Course is ready to be published</p>
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

                         <Tooltip title="Delete Course">
                            <DeleteOutlined className='h3 pointer text-danger p-3' />
                          </Tooltip>
                      </div>
                    </div>
                  </div>
        
              </>
            ))}
        </div>
        
       
      </UserRoute>
      <div className='spacer-500' />
      <FooterSection />
    </>
  );
};

export default AdminCourses;


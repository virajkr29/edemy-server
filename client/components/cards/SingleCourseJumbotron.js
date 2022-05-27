import React from 'react'
import { currencyFormatter } from '../../utils/helper';
import { Badge,Button,Modal } from 'antd';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import ReactPlayer from 'react-player';
import { MessageOutlined, ReadOutlined, SafetyCertificateOutlined, StarOutlined } from '@ant-design/icons';

const SingleCourseJumbotron = (
    {course,
        setShowModal,
        showModal,
        setPreview,
        preview,
        user,
        loading,
        handleFreeEnrollment,
        handlePaidEnrollment,
        enrolled,
        setEnrolled
}) => {

    const {
        name,
        description,
        instructor,
        updatedAt,
        lessons,
        image,
        price,
        paid,
        category,
      } = course;


  return (
    <>
    <div className='container-fluid'>
        <div className='row'>
          {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
          <div className="jumbotron br-primary square">
              <div className="row">
                  <div className="col-md-8">
                      <h1 className='text-light font-weight-bold'>{name}</h1>
                      <Badge count={category} style={{backgroundColor: '#51d33d'}} className="pb-4 mr-2"/>

                      <p>Created By {instructor.name}</p>

                      <p>Last Updated At {new Date(updatedAt).toLocaleDateString()}</p>

                      <h4 className='text-light'>
                          {paid ? currencyFormatter({
                              amount:price,
                              currency: 'usd'
                          })
                          : "Free"
                        }                       
                      </h4>
                      {/* Enroll Button is Working Here */}

                      {loading ? (
                        <div className='d-flex justify-content-center'>
                          <SafetyCertificateOutlined className='h1 text-danger' />
                        </div>
                      ): (
                        <Button
                          className='mb-5 px-5'
                          type='danger'
                          shape='round'
                          icon={<ReadOutlined />}
                          size='large'
                          disabled={loading}
                          onClick={paid ? handlePaidEnrollment: handleFreeEnrollment}
                          style={{fontSize:'16px'}}
                        >
                          {user ? enrolled.status ? "Go To Dashboard":"Enroll": "Login To Enroll"}
                        </Button>

                      )}
                  </div>

                  <div className="col-md-4">

                     {/* show video preview */}
                     {lessons && lessons[0].video && lessons[0].video.Location ? 
                     <div onClick={()=>{
                         setPreview(lessons[0].video.Location)
                         setShowModal(!showModal);
                     }}>

                         <ReactPlayer 
                           classNanme="react-player-div"
                           url={lessons[0].video.Location}
                           light={image.Location}
                           width="100%"
                           height="225px"
                         />

                     </div> : (
                         <>
                           <img src={image&& image.Location ?image.Location:"course.jpg"} alt={name} className="img img-fluid" />
                         </>
                     )}
                    {/* enroll button */}
                    <p>Show Course Video Preview</p>


                  </div>
              </div>
          </div>

          {/* Description Of the Courses here */}

          <div className="container-fluid">
                      <div className="row p-5">
                      <div className="col-md-8">
                          <ReactMarkdown children={description && description} />
                      </div>

          {/* Course preview Here */}
                      <div className="col-md-4">

                      </div>
          </div>

          </div>
        </div>
      </div>

    </>
  )
}

export default SingleCourseJumbotron
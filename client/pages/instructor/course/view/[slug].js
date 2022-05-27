import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserRoute from '../../../../components/routes/UserRoute';
import axios from 'axios';
import { Avatar, Tooltip, Button, Modal, List } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);

  const [values, setValues] = useState({
    title: '',
    content: '',
    embed: '',
    video: {},
  });

  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  const { slug } = router.query;

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  useEffect(() => {
    console.log(slug);
    loadCourse();
  }, [slug]);

  //Remove the video lessons
  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        '/api/course/video-remove',
        values.video
      );
      console.log(data);

      setValues({ ...values, video: {} });
      setUploading(false);
      setUploadButtonText('Upload Another Video');
      toast('Video Was Removed Successfully! Try Uploading Another Video ?');
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast('Video Removal Failed ');
    }
  };

  //Functions for Add List Here
  const handleAddLesson = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`/api/course/lesson/${slug}`, values);

      console.log(data);
      setValues({ ...values, title: '', content: '',embed:'', video: {} });
      setVisible(false);
      setUploadButtonText('Upload Video');
      setCourse(data);
      toast('New Lesson has been added to the existing course');
    } catch (err) {
      console.log(err);
      toast('Video Upload Failed ! Please Try Again');
    }
  };

  //Add Video
  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);

      setUploading(true);

      //sending the video as form data
      //Form data is used with the browser api
      const videoData = new FormData();

      videoData.append('video', file);
      //save progress bar and send video as form data to backend
      const { data } = await axios.post('/api/course/video-upload', videoData, {
        onUploadProgress: (e) => {
          setProgress(Math.round((100 * e.loaded) / e.total));
        },
      });
      console.log(data);
      setValues({ ...values, video: data });

      setUploading(false);
      toast('Video Uploaded Successfully');
    } catch (err) {
      console.log(err);
      toast('Video Upload Failed');
    }
  };
  //once response is recieved we can console log and destructure it in the values
  //Destructuring just change the values !!!
  //!! Be very careful with destructuring !!

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you publish your course will be live in the marketplace for the users to enroll in the Marketplace.'
      );

      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast('Congrats Your Course is Live !');
    } catch (err) {
      console.log(err);
      toast('Course Publish Failed !Please Try Again !');
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you publish your course will not be available for users to enroll in the Marketplace'
      );

      if (!answer) return;

      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast('Course Unpublished Successfully !');
    } catch (err) {
      console.log(err);
      toast('Unable to Remove Course ! Please Try Again !');
    }
  };

  return (
    <UserRoute>
      <h1 className='jumbotron text-center square'>Course Dashboard</h1>
      <div className='container-fluid pt-3'>
        {course && (
          <div className='container-fluid pt-1'>
            <div className='media pt-2'>
              <div className='media-body pl-2'>
                <div className='row'>
                  <div className='col-md-2'>
                    <Avatar
                      size={80}
                      src={
                        course.image ? course.image.Location : '/course.jpeg'
                      }
                    />
                  </div>

                  <div className='col-md-6'>
                    <h5 className='mt-2 text-primary'>{course.name}</h5>
                    <p style={{ marginTop: '-10px' }}>
                      {course.lessons && course.lessons.length}
                    </p>
                    <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                      {course.category}
                    </p>
                  </div>
                  {/* Edit the Courses here as we can see */}
                  <div className='col-md-4 d-flex'>
                    <Tooltip title='Edit'>
                      <EditOutlined
                        onClick={() => {
                          router.push(`/instructor/course/edit/${slug}`);
                        }}
                        className='h5 pointer text-warning mr-4 pe-4'
                      />
                    </Tooltip>
                    <br />

                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title='Minimum 5 Lessons Required to Publish'>
                        <QuestionCircleOutlined className='h5 pointer text-warning' />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title='Unpublish'>
                        <CloseOutlined
                          className='h5 pointer text-warning'
                          onClick={(e) => {
                            handleUnpublish(e, course._id);
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title='Publish'>
                        <CheckOutlined
                          className='h5 pointer text-success'
                          onClick={(e) => {
                            handlePublish(e, course._id);
                          }}
                        />
                      </Tooltip>
                    )}

                    {/* Publishing the final version of the course here */}
                  </div>
                  <hr />
                </div>

                <div className='row'>
                  <div className='col mt-3'>
                    <ReactMarkdown children={course.description} />
                  </div>

                  <div className='row'>
                    <div className='col mt-3'>
                      <Button
                        onClick={() => setVisible(true)}
                        className='col-md-6 offset-md-3 text-center'
                        type='primary'
                        shape='round'
                        icon={<UploadOutlined />}
                        size='large'
                      >
                        Add Lesson
                      </Button>
                    </div>
                  </div>
                  <br />

                  <Modal
                    title='+ Add Lesson'
                    centered
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    footer={null}
                  >
                    <AddLessonForm
                      values={values}
                      setValues={setValues}
                      handleAddLesson={handleAddLesson}
                      handleVideo={handleVideo}
                      handleVideoRemove={handleVideoRemove}
                      uploading={uploading}
                      setUploading={setUploading}
                      uploadButtonText={uploadButtonText}
                      progress={progress}
                    />
                  </Modal>

                  <div className='row pb-5'>
                    <div className='col'>
                      <h1 className='pt-4'>Lessons Available :</h1>
                      <h4>
                        {course && course.lessons && course.lessons.length}
                        Lessons
                      </h4>

                      <List
                        itemLayout='horizontal'
                        dataSource={course && course.lessons}
                        renderItem={(item, index) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar>{index + 1}</Avatar>}
                              title={item.title}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* <pre>{JSON.stringify(course,null,4)}</pre>  */}
      </div>
    </UserRoute>
  );
};

export default CourseView;

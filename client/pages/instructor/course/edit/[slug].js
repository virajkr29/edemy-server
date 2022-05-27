import axios from 'axios';
import { useState, useEffect } from 'react';
import UserRoute from '../../../../components/routes/UserRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import FooterSection from '../../../../components/footer/FooterSection';
import Resizer from 'react-image-file-resizer'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router';
import { List,Avatar,Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

const {Item} = List

//Edit course starts 
const EditCourse = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons:[]
  });

  //All the useStates props
  const [image,setImage] = useState({})
  const [preview, setPreview] = useState('');
  const [uploadButtonText,setUploadButtonText] = useState('Upload Image')

  //states for lessons and uploading Videos here
  const [visible,setVisible] = useState(false)
  const [current,setCurrent] = useState({})
  const [uploadVideoButtonText,setUploadVideoButtonText] = useState('Upload Video')
  const [progress,setProgress] = useState(0)
  const [uploading,setUploading] = useState(false)


  const router = useRouter()
  const {slug} = router.query

  console.log("SLUG IS:::",slug)

  useEffect(()=>{
      loadCourse()

  }, [slug])

  const loadCourse = async()=>{

    const {data} = await axios.get(`/api/course/${slug}`)
    if(data) setValues(data)
    if(data && data.image) setImage(data.image)
  }

  const handleChange = (e) => {
    //the images are always send as an array so we will give the file as we can see here
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  //handle the images as we can see here
  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadButtonText(file.name);
    setValues({...values,loading:true});

    //Resize the image data making the post request then we are recieving the response 
    Resizer.imageFileResizer(file,720,500,"JPEG",100,0, async(uri)=>{
      try{
        let {data} = await axios.post('/api/course/upload-image',{
          image:uri,
        })

        console.log("IMAGE UPLOADED",data)
        //sete image in the state and show toast data as seen here
        
        //set the loading to false
        setValues({...values,loading:false}) 
        setImage(data)

        toast("Image Upload Successful")

      }catch(err){
        console.log(err)
        setValues({...values,loading:false})
        toast('Image Upload Failed. Try Later')
      }
    })
  };

  //remove the image
  const handleRemoveImage = async() =>{
    console.log("REMOVE IMAGE")
    try{
      const res = await axios.post('/api/course/remove-image',{image})

    setValues({...values,loading:true})
    setImage({})
    setPreview('')
    setUploadButtonText('Upload Image')
    setValues({...values,loading:false})

    }catch(err){
      console.log(err)
      setValues({...values,loading:false})
      toast("Course Creation Failed ! Please Try Again !")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log(values);
        try{

            const {data} = await axios.put(`/api/course/${slug}`,{
              ...values,
              image,
             })
             router.push('/user')
             toast('Great ! Now you can start adding Lessons')
             toast("Course Updated")
            
          }catch(err){
            console.log(err)
            toast(err.response.data)
          }
     
  };

  const handleDrag = (e,index) =>{
   // console.log("ON DRAG >>::==>",index)
   e.dataTransfer.setData('itemIndex',index)


  }
  const handleDrop = async(e,index) =>{
   // console.log("ON DROP >>::==>",index)
   const movingItemIndex = e.dataTransfer.getData("itemIndex")
   const targetItemIndex = index

   let allLessons = values.lessons
   let movingItem = allLessons[movingItemIndex]//clicked or dragged elements

   allLessons.splice(movingItemIndex,1) //Remove 1 item from the given index
   //Splice can be used to move the item too
   allLessons.splice(targetItemIndex,0,movingItem)//Not removing anything but pushing the target item

   setValues({...values,lessons:[...allLessons]})

   //save the lessons in the database 
   
   const {data} = await axios.put(`/api/course/${slug}`,{
    ...values,
    image,
   })
   console.log("LESSONS REARRANGED RESPONSE:",data)
   toast("Lessons Rearranged Successfully")

  }

  const handleDelete = async(index)=>{
    //Show a popup modal and if they say yes then delete the lesson 
    const answer = window.confirm("Are you sure ? You want to Delete ?")

    if(!answer) return 
    let allLessons = values.lessons
   const removed =  allLessons.splice(index,1)

   console.log("REMOVED ELEMENT ==>",removed[0]._id)
    setValues({...values,lessons: allLessons})
    //send request to server 
    
    const {data} = await axios.put(`/api/course/remove/${slug}/${removed[0]._id}`)
    console.log('LESSON DELETED ==> ',data)

    toast("Course Deleted Successfully !")

    //send request to backend and then delete 

  }

  // Lesson Update Functions Here
  const handleUpload = async(e)=>{
    

  }

  const handleVideo = async(e)=>{
    console.log("HANDLE VIDEO")

    console.log("HANDLE UPLOAD")
    
    //remove previous video 
    if(current.video && current.video.Location){
      const res = await axios.post(`/api/course/video-remove`,current.video)
      console.log("VIDEO REMOVED RESPONSE ==>",res)
    }

    //upload Video
    const file = e.target.files[0]
    setUploadVideoButtonText(file.name)
    setUploading(true)
    const videoData = new FormData()
    videoData.append('video',file)
    videoData.append('courseId',values._id)

    const {data} = await axios.post(`/api/course/video-upload`,videoData,{
      onUploadProgress: (e)=>
        setProgress(Math.round((100*e.loaded)/e.total))
      
    })

    console.log(data)
    setCurrent({...current,video:data})
    setUploading(false)
    toast("Video Updated Successfully")

  }

  const handleUpdateLesson = async(e)=>{
    console.log("HANDLE UPDATE LESSON")
    e.preventDefault()

    const {data} = await axios.put(`/api/course/lesson/${slug}/${current._id}`,
     current
    )
    setUploadButtonText('Upload Video')
    setVisible(false)
    setCurrent(data)

    //update UI
    if(data.ok){
      //remove the lesson from the lessons array and set value one more time
      let arr = values.lessons
      const index = arr.findIndex((el)=>el._id===current._id)

      arr[index] = current
      setValues({...values,lessons:arr})
    }
    toast("Lesson Updated Successfully")

  }


  return (
    <>
      <UserRoute>
        <h1 className='jumbotron text-center square'>Edit Course Here</h1>
        {/* <pre>{JSON.stringify(values,null,4)}</pre> */}
        <div className='pt-3 pb-3'>
          <CourseCreateForm
            handleSubmit={handleSubmit}
            handleImage={handleImage}
            handleChange={handleChange}
            handleRemoveImage={handleRemoveImage}
            values={values}
            setValues={setValues}
            preview={preview}
            image={image}
            uploadButtonText = {uploadButtonText}
            editPage={true}
         />
        </div>
        <hr />

        <div className='row pb-5'>
                    <div className='col'>
                      <h1 className='pt-4'>Lessons Available :</h1>
                      <h4>
                        {values && values.lessons && values.lessons.length}
                        Lessons
                      </h4>

                      <List
                        onDragOver = {e=>e.preventDefault()}
                        itemLayout="horizontal"
                        dataSource={values &&values.lessons}
                        renderItem={(item,index) => 
                          (
                            <List.Item draggable onDragStart={e=> handleDrag(e,index)} onDrop={e=>handleDrop(e,index)}>
                              <List.Item.Meta
                              
                              onClick={()=>{
                                  //  
                                  setVisible(true)
                                  setCurrent(item)

                              }}
                              avatar = {<Avatar>{index+1}</Avatar>}
                               title = {item.title}
                              />
                              {/* We dont have to wait the given item to be deleted and will imediately delete the item */}
                              <DeleteOutlined onClick={()=>{handleDelete(index)}} className="text-danger float-right"/>
                            </List.Item>
                          )
                        }
                     />
                     </div>
                     </div>

                     <Modal title = "Update Lesson" centered visible={visible} onCancel={()=>{setVisible(false)}} footer={null}>
                     {/* <pre>{JSON.stringify(current,null,4)}</pre> */}
                   
                     <UpdateLessonForm 
                       current={current}
                       setCurrent={setCurrent}
                       
                       //Functions for uploading the video to keep track of the upload state
                       //Create the placeholder functions
                       handleUpload = {handleUpload}
                       handleVideo = {handleVideo}
                       handleUpdateLesson = {handleUpdateLesson}

                       //States for the Video as seen here
                       uploadVideoButtonText = {uploadVideoButtonText}
                       uploading = {uploading}
                       progress = {progress}

                     />

                     </Modal>

                     
        

      </UserRoute>
      <FooterSection />
    </>
  );
};

export default EditCourse;

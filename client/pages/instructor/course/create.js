import axios from 'axios';
import { useState, useEffect } from 'react';
import UserRoute from '../../../components/routes/UserRoute';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';
import FooterSection from '../../../components/footer/FooterSection';
import Resizer from 'react-image-file-resizer'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router';



const CreateCourse = () => {
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
  });

  const [image,setImage] = useState({})
  const [preview, setPreview] = useState('');
  const [uploadButtonText,setUploadButtonText] = useState('Upload Image')

  const router = useRouter()

  const handleChange = (e) => {
    //the images are always send as an array so we will give the file as we can see here
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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

        const {data} = await axios.post('/api/course',{
          ...values,
          image,
         })
         toast('Great ! Now you can start adding Lessons')
         router.push('/user')

      }catch(err){
        console.log(err)
        toast(err.response.data)
      }

     
  };

  return (
    <>
      <UserRoute>
        <h1 className='jumbotron text-center square'>Create A Course Here</h1>
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
          />
        </div>
        <pre>{JSON.stringify(values, null, 4)}</pre>
        <pre>{JSON.stringify(image, null, 4)}</pre>

      </UserRoute>
      <FooterSection />
    </>
  );
};

export default CreateCourse;

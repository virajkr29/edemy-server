import express from 'express';
import { requireSignin,isEnrolled } from '../middlewares';
import {
  addLesson,
  createCourse,
  updateCourse,
  removeImage,
  uploadImage,
  readCourse,
  uploadVideo,
  removeVideo,
  removeLesson,
  updateLesson,
  publishCourse,
  unpublishCourse,
  getAllCourses,
  checkEnrollment,
  freeEnrollment,
  userCourses,
  getCoursesByCategory,
  paidEnrollment,
  stripeSuccess,
  getAllCoursesAdmin,
  searchCourses
} from '../controllers/courseController';
import formidable from 'express-formidable';

//Order of the routes are very important as we can see in this application here
//Always make sure that the routes are in proper order 
//Or the endpoints are specific to the functionality and the order is systematic

const router = express.Router();

router.get('/courses',getAllCourses)

//Course Search
router.get('/course/search/:key',searchCourses)

router.post('/course/upload-image', uploadImage);
router.post('/course/remove-image', removeImage);

router.post('/course/video-upload', requireSignin, formidable(), uploadVideo);
router.post('/course/video-remove', requireSignin, removeVideo);
router.post('/course/lesson/:slug', requireSignin, addLesson);

//course creation
router.post('/course', requireSignin, createCourse);

router.get('/course/:slug', readCourse);

router.put('/course/:slug', requireSignin, updateCourse);

router.put('/course/remove/:slug/:lessonId', requireSignin, removeLesson);

router.put('/course/lesson/:slug/:lessonId', requireSignin, updateLesson);

//course publish and unpublish
router.put("/course/publish/:courseId",requireSignin,publishCourse)
router.put("/course/unpublish/:courseId",requireSignin,unpublishCourse)

//User Enrollment
router.get('/check-enrollment/:courseId',requireSignin,checkEnrollment)

//Enrollment
router.post('/free-enrollment/:courseId',requireSignin,freeEnrollment)
router.post('/paid-enrollment/:courseId',requireSignin,paidEnrollment)

//Stripe Success
router.get('/stripe-success/:courseId',requireSignin,stripeSuccess)

//Courses Enrolled 
router.get('/user-courses',requireSignin,userCourses)

//Middleware function which will check if the user has enrolled or not !!
router.get('/user/course/:slug',requireSignin,isEnrolled,readCourse)

//Course Category 
router.get('/courses/category/:cat',getCoursesByCategory)

router.get('/admin-courses',getAllCoursesAdmin)







module.exports = router;

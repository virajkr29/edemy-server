import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import Course from '../models/courseModel';
import slugify from 'slugify';
import { readFileSync } from 'fs';
import User from '../models/userModel';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
  try {
    //Make sure that we have the image

    const { image } = req.body;
    if (!image) return res.status(400).send('No Image Found');

    //prepare image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const type = image.split(';')[0].split('/')[1];

    //image params
    const params = {
      Bucket: 'vrjedemybucket',
      Key: `${nanoid()}.${type}`, //.jpeg which is our filename
      Body: base64Data,
      ACL: 'public-read',
      ContentEncoding: 'base64',
      ContentType: `image/${type}`,
    };
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeImage = async (req, res) => {
  try {
    //start
    const { image } = req.body;

    const params = {
      Bucket: image.Bucket,
      Key: image.key,
    };

    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });

    //end
  } catch (err) {
    console.log(err);
  }
};
//Course slug is generated based on the title
//react-course-for-beginners(Empty spaces will be stored with -)
export const createCourse = async (req, res) => {
  console.log('CREATE COURSE', req.body);
  try {
    const alreadyExists = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });

    if (alreadyExists) return res.status(400).send('Title is Already Taken');

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);

    return res.status(400).send('Course creation failed ! Please Try Again !');
  }
};

export const readCourse = async (req, res) => {
  try {
    let { userId } = req.params;
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', '_id name')
      .exec();
    console.log('USER ID ===>', userId);

    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const uploadVideo = async (req, res) => {
  try {
    const { video } = req.files;
    console.log(video);

    if (!video) {
      return res.status(400).send('No Video Recieved');
    }

    const params = {
      Bucket: 'vrjedemybucket',
      Key: `${nanoid()}.${video.type.split('/')[1]}`, //.mp4 which is our filename for video
      Body: readFileSync(video.path),
      ACL: 'public-read',
      ContentType: video.type,
    };

    //Upload to S3

    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }

      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeVideo = async (req, res) => {
  try {
    //select the files and delete the video
    const { Bucket, Key } = req.body;

    const params = {
      Bucket,
      Key, //.mp4 which is our filename for video
    };

    //Upload to S3

    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }

      console.log(data);
      res.send({ ok: true });
    });
    //The issue was I was making request with the wrong url
    //We may get this error which is not due to the csrf token but the
    //request send to a wrong endpoint as we can see
  } catch (err) {
    console.log(err);
  }
};

export const addLesson = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, video, embed } = req.body;

    //We have lessons array
    //Each lesson must satisfy the schema as we can see here
    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: {
          lessons: {
            title,
            content,
            embed,
            video,
            slug: slugify(title),
          },
        },
      },
      { new: true }
    )
      .populate('_id name')
      .exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Add Lesson Failed');
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { slug } = req.params;

    console.log(slug);

    const course = await Course.findOne({ slug }).exec();

    console.log('COURSE FOUND : ==>>', course);

    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
  }
};

export const removeLesson = async (req, res) => {
  try {
    const { slug, lessonId } = req.params;
    const course = await Course.findOne({ slug }).exec();

    const deletedCourse = await Course.findByIdAndUpdate(course._id, {
      $pull: { lessons: { _id: lessonId } },
    }).exec();

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const updateLesson = async (req, res) => {
  try {
    console.log('UPDATE LESSON ==>', req.body);

    const { slug } = req.params;

    const course = await Course.findOne({ slug }).select('instructor').exec();

    const { title, content, embed, video, free_preview, _id } = req.body;

    //We are updating one of the array of the course and it is difficult
    const updated = await Course.findOneAndUpdate(
      { 'lessons._id': _id },
      {
        $set: {
          'lessons.$.title': title,
          'lessons.$.content': content,
          'lessons.$.embed': embed,
          'lessons.$.video': video,
          'lessons.$.free_preview': free_preview,
        },
      },
      { new: true }
    ).exec();

    console.log(updated);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Update Lesson Failed');
  }
};

export const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select('instructor').exec();

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: true },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Publish Course Failed');
  }
};

export const unpublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).select('instructor').exec();

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { published: false },
      { new: true }
    ).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Publish Course Failed');
  }
};

//We can try it in the browser we should be able to see an array of courses

export const getAllCourses = async (req, res) => {
  const all = await Course.find({ published: true })
    .populate('instructor', '_id name')
    .exec();

  res.json(all);
};

export const getAllCoursesAdmin = async (req, res) => {
  const all = await Course.find().populate('instructor', '_id name').exec();

  res.json(all);
};

export const checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    //Find all the courses of currently logged in user

    const user = await User.findById(req.user._id).exec();
    console.log('USER INFO==>', req.user._id);

    //Check if the course found in the user course array
    let ids = [];
    let length = user.courses && user.courses.length;
    for (let i = 0; i < length; i++) {
      ids.push(user.courses[i].toString());
      console.log(ids[i]);
    }

    res.json({
      status: ids.includes(courseId),
      course: await Course.findById(courseId).exec(),
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send('Course Enrolled Not Found ');
  }
};

export const freeEnrollment = async (req, res) => {
  try {
    //check the course is free or not

    const course = await Course.findById(req.params.courseId).exec();
    if (course.paid) return;

    const result = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { courses: course._id },
      },
      { new: true }
    ).exec();

    res.json({
      message:
        'Congratulations ! You have Successfully Enrolled in the Course ',
      course,
    });
  } catch (err) {
    console.log('FREE ENROLLMENT ERROR', err);
    return res.status(400).send('Enrollment Creation Failed !');
  }
};

export const paidEnrollment = async (req, res) => {
  try {
    //Regarding the paid enrollment as seen here

    //check if course is free or paid as we can see here
    const course = await Course.findById(req.params.courseId)
      .populate('instructor')
      .exec();

    if (!course.paid) return;
    //application fee is 30 % of fees and 70 % goes to the user
    //Including the 3 % charge for the fees

    const fee = (course.price * 30) / 100;

    //create stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      //purchase details
      line_items: [
        {
          name: course.name,
          amount: Math.round(course.price.toFixed(2) * 100),
          currency: 'usd',
          quantity: 1,
        },
      ],

      //charge buyer and transfer remaining balance to seller here
      /*
          payment_intent_data : {
            application_fee_amount: Math.round(course.price.toFixed(2)*100),
            transfer_data:{destination:'acct_1L0T1NSFnfvqEh7R'}
            ,
        },
       */
      //Redirect URL after successful payment here
      //mode: 'payment',
      success_url: `${process.env.STRIPE_SUCCESS_URL}/${course._id}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,

      payment_intent_data: {
        //application_fee_amount: Math.round(course.price.toFixed(2)*100),
        transfer_data: { destination: 'acct_1L0oSwSFwGDeZcO3' },
      },
    });
    // console.log('SESSION ID =>',session)
    await User.findByIdAndUpdate(req.user._id, {
      stripe_session: session,
    }).exec();
    res.send(session.id);
  } catch (err) {
    console.log('PAID ENROLLMENT ERROR HERE::==>', err);
    return res.status(400).send('Enrollment Creation Failed!!');
  }
};

export const stripeSuccess = async (req, res) => {
  try {
    // find course
    const course = await Course.findById(req.params.courseId).exec();

    //get user form DB from session id
    const user = await User.findById(req.user._id).exec();
    //console.log("USER ===>",req.user._id)

    if (!user.stripe_session.id) return res.sendStatus(400);

    //retrive stripe sessions
    const session = await stripe.checkout.sessions.retrieve(
      user.stripe_session.id
    );
    console.log('STRIPE SESSION ID ==>', session);

    //if session status payment is paid then push course to users course [] array
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { courses: course._id },
      $set: { stripe_session: {} },
    }).exec();

    res.json({ success: true, course });
  } catch (err) {
    console.log('STRIPE SUCCESS ERR', err);
    res.json({ success: false });
  }
};

//Find the list of all the user courses as we can see here.
export const userCourses = async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  //If for some reason if the payment fails then we can continue and see if payment was failed or succeed
  const courses = await Course.find({ _id: { $in: user.courses } })
    .populate('instructor', '_id name')
    .exec();

  res.json(courses);
};

export const getCoursesByCategory = async (req, res) => {
  console.log('GET COURSES==>');
  const { cat } = req.params;
  console.log(cat);

  const courses = await Course.find({
    category: req.params.cat,
    published: true,
  })
    .populate('instructor', '_id name')
    .exec();
  res.json(courses);
};

export const searchCourses = async (req, res) => {
  try {
    console.log('SEARCH COURSES ==>');
    const { key } = req.params;
    console.log(key)
    

        const courses = await Course.find({
            $or: [
                {
                    name: { $regex: key, $options: 'i'}
                },
                {
                    description:{
                        $regex: key, $options:'i'
                    }
                }
            ],
            published:true
        }
        )
        .populate('instructor', '_id name')
        .exec()



      console.log(courses)
    res.json(courses)

  } catch (err) {
    console.log(err);
    res.sendStatus(404);
  }
};


/*

    const courses = await Course.find({
        
    })
      .populate('instructor', '_id name')
      .exec();
*/
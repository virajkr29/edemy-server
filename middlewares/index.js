//npm install express-jwt and verify the given data from the token 
//If it is valid it will give the same information and access the requ.user.id for the users id
import expressJwt from 'express-jwt'
import User from '../models/userModel'
import Course from '../models/courseModel'

export const requireSignin = expressJwt({
    //passing the token 
    //passing the seeder for the token 
    //add the algorithm as we can see here
    getToken: (req,res) => req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    
})

export const isEnrolled = async(req,res,next)=>{
    try{
        const user = await User.findById(req.user._id)
        const course = await Course.findOne({slug: req.params.slug}).exec()

        //check if the course id is found by user
        let ids = []

        for(let i=0;i<user.courses.length;i++){
            ids.push(user.courses[i].toString())
        }

        if( !ids.includes(course._id.toString())){
            res.sendStatus(403)

        }else{
            next()
        }

    }catch(err){
        console.log(err)
    }

}
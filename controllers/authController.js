import User from '../models/userModel'
import  {hashPassword,comparePassword} from '../utils/auth'
import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'


const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
}

const SES = new AWS.SES(awsConfig)

export const register = async (req,res)=>{

         try{
             const {name,email,password} = req.body

             //Valdidations here
             if( !name) return res.status(400).send('Name is Required')
             if(!password || password.length <6){
                 return res
                 .status(400)
                 .send('Password is required and should be 6 or more characters long')
             }

             let userExist =await User.findOne({email}).exec()

             if(userExist){
                return res.status(400).send('Email is taken') 
             }

             //hash the password 
             const hashedPassword = await hashPassword(password)

             //register
             const user = new User({
                 name,email,
                 password:hashedPassword
             })

            await user.save()

             console.log("saved user :",user)
             return res.json({ok:true})

         } catch(err){
             console.log(err)
             return res.status(400).send('Error ! Try Again !')
         }
}


export const login = async(req,res) =>{
    
    try {
        //Here we are recieving the data from the client to the server endpoint 
        //check if our database has the ata 

        const {email,password} = req.body

        const user = await User.findOne({email}).exec()

        if( !user) return res.status(400).send("No User Found ")

        //check password
        const match = await comparePassword(password,user.password)

        if(!match){
            return res.status(400).send('Wrong Password ! Please Try Again')
        }

        //create the signed jwt 
        const token = jwt.sign({
            //store the data if you want 
            _id: user._id,


        //Here we are using the JSON web token to add the user and make sure that if the 
        //User is signed in for more than 7 days then he will simply get logged out once the session is expired

        },process.env.JWT_SECRET, {expiresIn:"7d",

    })
    //return the user and token to the client and you dont want to send the hashed password
    user.password = undefined
    let message = "Login Successful "

    res.cookie("token",token,{
        httpOnly:true,
    })
    //send user a json response 
    //res.json(message)
    res.json(user)
    } catch(err){
        console.log(err);
        return res.status(404).send("Error. Try Again")

    }
}

export const logout = async(req,res)=>{
    try{
        //Removing the cookie by the name of token and then we have
        res.clearCookie("token")
        return res.json({message:"Sign out Success"})

    }catch(err){
        console.log(err)
    }
}


export const currentUser = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).select('-password').exec()
        console.log('CURRENT USER',user)

        return res.json({ok:true,user:user})

    }  catch(err) {
        console.log(err)
    }
}

//sending the email and where to send the email as seen here
export const sendTestEmail = async(req,res)=>{
    //console.log("Send Email Using SES ")
     // res.json({ok:true})

    const params = {
        Source: process.env.EMAIL_FROM,
        Destination:{
            ToAddresses:  ['vrjblog@gmail.com'],
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message:{
            Body:{
                Html:{
                    Charset: "UTF-8",
                    Data: `
                      <html>
                        <h1>Reset Password Link </h1>
                        <p>Please use the following link to reset your password</p>
                      </html>
                    `,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Password Rest Link From Edemy Marketplace"
            }
        },
    } 

    const emailSent = SES.sendEmail(params).promise()

    emailSent.then((data)=>{
        console.log(data)
        res.json({ok:true})
    }).catch((err)=>{
        console.log(err)
    })
}

export const forgotPassword = async( req,res)=>{
    try{
        const {email} = req.body

        //console.log(email)
        //We want to generate some code and send the data to the database as well
        //Use the npm short id to perform the id operations 
        const shortCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate({email}, {passwordResetCode: shortCode})

        if(!user) return res.status(400).send("User not found")

        //Perform all the operations related to the email
        //Prepare for email

        const params = {
            Source: process.env.EMAIL_FROM,
            Destination:{
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Html:{
                        Charset: 'UTF-8',
                        Data: `
                         <html>
                         <h1> Reset Password </h1>
                         <p>Use this code to reset the password</p>
                         <h2 style="color:red;">${shortCode}</h2>
                         <i>Edemy Marketplace<i/>
                         
                         </html>
                        `
                    }
                },
                Subject:{
                    Charset: 'UTF-8',
                    Data: "Reset Password"
                }
            }
        }

        const emailSent = SES.sendEmail(params).promise()
        emailSent.then((data)=>{
            console.log(data)
            res.json({ok:true})
            
        }).catch((err)=>{
            console.log(err)
        })

    }catch(err){
        console.log(err)
    }
}

export const resetPassword = async(req,res)=>{
    try {
        const {email,code,newPassword} = req.body
        console.table({email,code,newPassword})
        //Find the user and chage the password as we can see here
        //We will have to hashed password and then store it in the database 

        const hashedPassword = await hashPassword(newPassword)

        const user = User.findOneAndUpdate({
            email,passwordResetCode: code,
        },{password: hashedPassword,
            passwordResetCode:"",
        }).exec()

        res.json({ok:true})



    }catch(err){
        console.log(err)
        return res.status(400).send("Error ! Please Try Again,")
    }
}
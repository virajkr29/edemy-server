const express = require('express')
import cors from 'cors'
import {readdirSync} from 'fs'
const morgan = require('morgan')
require('dotenv').config();
import mongoose from 'mongoose'
import csrf from "csurf"
import cookieParser from 'cookie-parser'

const csrfProtection = csrf({cookie:true})

//Create the Express Application


const app = express();

//apply some midlewares
//some code which will run before any response is send from the client
//When server recives some data it processes the request and sends the data

//Database Connection Work here
//Configuration object is used to slowdown the nasty warnings

//Create the connection using the connection string and if possible also valdiate the connection
//Using the try catch

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(()=>{
  console.log('****DB Connected****')
}).catch((err)=>{
  console.log("DB Connection Error ",err)
})


//Apply all the Middlewares
app.use(cors())
app.use(express.json({limit: "10mb"}))
app.use(morgan("dev"))
app.use(cookieParser())



//Routing the data and here
app.get('/', (req,res)=>{
    //Think of express as request and response handler
    res.send('You hit server endpoint')

})

//routes are being imported automatically as we can see in here
readdirSync('./routes').map((r)=>{
  app.use('/api', require(`./routes/${r}`))
})


//csrf protection 
app.use(csrfProtection)

app.get('/api/csrf-token', (req,res)=>{
  res.json({csrfToken: req.csrfToken()})
})

//Anytime you make any changes to dotenv file we will have to restart the server
//Port on which the server will be running by default 8000
const port = process.env.PORT || 8000

app.listen(port, ()=>console.log(`Server is running on port ${port}`))

//Controller are used to control the routes 
//We can take the function and movie it to seperate function called controllers
//Create the callback function to keep the things simple and organized 


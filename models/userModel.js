import mongoose from 'mongoose'

const {Schema}  = mongoose
const {ObjectId} = Schema
//Hashing the password using the Bcrypt library 
//We can define the max and min chas

const userModel = new Schema({
    name:{
        type: String,
        trim:true,
        require:true,

    },
    email:{
        type: String,
        trim:true,
        require:true,
        unique:true,

    },
    password:{
        type: String,
        require:true,
        min:6,
        max: 64,

    },
    picture:{
        type:String,
        default: '/avatar.png',
    },
    role:{
        type: [String],
        default: ["Subscriber"],
        enum: ["Subscriber","Instructor","Admin"],

    },
    isAdmin:{
       type: Boolean,
       default: false
    },
    strip_account_id: '',
    stripe_seller: {},
    stripe_session: {},
    
    passwordResetCode: {
        data:String,
        default:''
    },
    
    courses: [{type: ObjectId,ref:"Course"}],


}, 
{timestamps:true }
)

export default mongoose.model('User',userModel)
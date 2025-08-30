import mongoose ,{Schema,Document} from 'mongoose'

export interface Message extends Document{
    content:string
    createdAt:Date
}

export const MessageSchema :Schema<Message> =new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})



export interface User extends Document{
    username:string
    email:string
    password:string
    verifyCode:string
    verifyCodeExpiry:Date
    isVerified:boolean
    tempVerifyStatus:boolean
    isAcceptingMessage:boolean
    messages:Message[]
    expireAt?:Date|null
}


const UserSchema :Schema<User> = new Schema({

    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match:[/.+\@.+\..+/,'please provide a valid email']
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    verifyCode:{
        type:String,
        required:[true,'verifyCode is required']
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCodeExpiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    tempVerifyStatus:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    expireAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) } ,
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>)||(mongoose.model<User>("User",UserSchema))


export default UserModel;
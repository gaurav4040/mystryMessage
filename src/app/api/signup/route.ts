import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import  {sendVerificationEmail}  from "@/helpers/sendVerificationEmail";


export async function POST(req:Request){

    await dbConnect()

    try {
        
        const {username,email,password} = await req.json()
        
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"user already exist"
            },{ status:400})
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000+Math.random()*900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"user already exist with this email"
                },{ status:400})
            }else{
                const hashedPassword = await bcrypt.hash(password,10)

                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)

                await existingUserByEmail.save();
            }
        }
        else{
            
            const hashedPassword = await bcrypt.hash(password,10)

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newUser.save();

        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:emailResponse.message
            },{ status:500}) 
        }
        return Response.json({
            success:true,
            message:"successfully registed new user"
        },{ status:201})
    } catch (error) {
        console.log(`Error registering new user :== ${error}`)
        return Response.json({
            success:false,
            message:"failed in registering new user"
        },{ status:500})
    }
}
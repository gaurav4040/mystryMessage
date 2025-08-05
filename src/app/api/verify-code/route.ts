import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";
import { userNameValidation } from "@/schemas/signUpSchema";



export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username,code} = await request.json();
        

        decodeURIComponent(username)
        decodeURIComponent(code)

        const codeResult = verifySchema.safeParse({code})
        const usernameResult = userNameValidation.safeParse(username)

        if(!codeResult.success||!usernameResult.success){
           
            return Response.json({
                success:false,
                message:"invalid username or code format"
            },{status:400})
        }

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:400})
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry)>new Date()

        if(user.isVerified&&isCodeValid && isCodeNotExpired){
            return Response.json({
                success:true,
                message:" OTP verified successfully"
            },{status:200})
        }
        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true
            await user.save()
            return Response.json({
                success:true,
                message:" Account verified successfully"
            },{status:200})
        }
        else if(!isCodeValid){
            return Response.json({
                success:false,
                message:" invalid code "
            },{status:400})
        }else{
            return Response.json({
                success:false,
                message:" code expired , sign-up again for new code"
            },{status:400})
        }

    } catch (error) {
        console.log(`error in verification of code`,error)
        return Response.json({
            success:false,
            message:'error verifying user'
        },{status:500})
    }
}
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
import { verifySchema } from "@/schemas/verifySchema";
import { userNameValidation } from "@/schemas/signUpSchema";

const verifyCodeSchema = z.object({
    verifyCode:verifySchema
})

const usernameQuerySchema = z.object({
    username:userNameValidation
})

export async function POST(request:Request) {
    await dbConnect()

    try {
        const {username,code} = await request.json();
        decodeURIComponent(username)
        decodeURIComponent(code)
        const codeResult = verifyCodeSchema.safeParse(code)
        const usernameResult = usernameQuerySchema.safeParse(username)

        if(!codeResult.success||!usernameResult.success){
           const usernameErrors = usernameResult.error?.format().username?._errors || [];
            const codeErrors = codeResult.error?.format().verifyCode?._errors || [];
            const errors =usernameErrors.length>0? usernameErrors.join(',') + ' , ' + codeErrors.join(','):codeErrors.join(',') 

            return Response.json({
                success:false,
                message:errors.length>0?errors:"invalid username or code format"
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
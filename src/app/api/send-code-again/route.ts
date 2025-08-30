// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";

export async function POST(request: Request) {

    try {

        // const {  username,email } = await request.json();
        const {  email } = await request.json();
        
        // const {searchParams} = new URL(request.url);
        // const purpose = searchParams.get("purpose");

        //TODO: const user = await UserModel.findOne({username})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours()+1)
        
        //TODO: const email1=user?.email

        await UserModel.findOneAndUpdate({email},{verifyCode:verifyCode,verifyCodeExpiry:expiryDate},{new:true})
        
       

        // const emailResponse = await sendVerificationEmail(
        //     String(email),
        //     String(username),
        //     purpose,
        //     verifyCode
        // )

        // if(!emailResponse.success){
        //     return Response.json({
        //         success:false,
        //         message:emailResponse.message
        //     },{ status:400}) 
        // }

        return Response.json({
            success:true,
            message:"code generated successfully",
            verifyCode,
            expiryDate
        },{ status:200}) 

    } catch (error) {
        console.log(`Error codeSending to email new user :== ${error}`)
        return Response.json({
            success:false,
            message:"failed to send code to email"
        },{ status:500})
    }
}
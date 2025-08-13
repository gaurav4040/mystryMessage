import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";




export async function POST(request:Request) {
    
    await dbConnect();
    try {
        const {email} = await request.json();

        const user = await UserModel.findOne({email});
        if(!user){
            return Response.json({
                success:false,
                message:"user not found in check-temp-verify-status"
            },{status:404})
        }

        if(!user.tempVerifyStatus){
            return Response.json({
                success:false,
                message:"not verified"
            },{status:400})
        }

        user.tempVerifyStatus=false;
        user.save();
        
        return Response.json({
            success:true,
            message:"verified"
        },{status:200})


    } catch (error) {
        console.log('error in check-temp-verify-status server',error)
        return Response.json({
            success:false,
            message:"internal server error in temp-verify"
        },{status:500});
    }
}
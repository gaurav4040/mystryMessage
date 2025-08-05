import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export async function POST(request:Request) {
    
    await dbConnect()

    try {
        const {username,email} = await request.json()
        const {searchParams} = new URL(request.url)
        const queryParam ={
            verificaionStatus:searchParams.get("verification-status")
        }

        console.log('dhekkk====>>>',username,email,queryParam.verificaionStatus)//TODO TODO:

        const user = await UserModel.findOneAndUpdate({email},{username:username},{new:true})
        
        await user?.save();
        
        if(!user){
            return Response.json({
            success:false,
            message:"user not found in update details"
            },{status:200})
        }


    } catch (error) {
        console.log("server error in update-details",error)
        return Response.json({
            success:false,
            message:error
        },{status:500})
    }
}
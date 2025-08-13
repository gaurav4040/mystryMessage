import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export async function POST(request:Request) {
    
    await dbConnect()

    try {
        const {username,email} = await request.json()
        const {searchParams} = new URL(request.url)
        const queryParam ={
            verificationStatus:searchParams.get("verification-status")
        }


        if(!queryParam.verificationStatus||queryParam.verificationStatus!=='true'){
            return Response.json({
                success:false,
                message:'verification is not ture'
            },{status:400});
        }
        const user = await UserModel.findOneAndUpdate({email},{username:username},{new:true})
        
        await user?.save();
        
        if(!user){
            return Response.json({
            success:false,
            message:"user not found in update details"
            },{status:200})
        }

        return Response.json({
            success:true,
            message:"user details Updated successfully"
        })


    } catch (error) {
        console.log("server error in update-details",error)
        return Response.json({
            success:false,
            message:error
        },{status:500})
    }
}
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";



export async function DELETE(request:Request) {

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("message_id");

    
    
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user

    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )

        if(updatedResult.modifiedCount==0){
            return Response.json({
                success:false,
                message:"message not found or already deleted"
            },{status:404})
        }
        return Response.json({
            success:true,
            message:"Message Deleted"
        })
    } catch (error) {
        console.log("error in deleting message===> ",error)
        return Response.json({
            success:false,
            message:"error deleting message"
        },{status:500})
    }
}
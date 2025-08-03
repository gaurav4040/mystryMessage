
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";


export async function POST(request:Request) {
    await dbConnect()

    const {username,content} = await request.json()

    try {
        
        const user = await UserModel.findOne({username})
        
        if(!user){
            return Response.json({
                success:false,
                message:"user not found"
            },{status:404})
        }

        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"currently this user not accepting messages"
            },{status:403})
        }

        const newMessage = {content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json({
            success:true,
            message:"message sent successfully"
        },{status:200})

    } catch (error) {
        console.log(`error in sending message :==>`,error)
        return Response.json({
            success:false,
            message:"error in sending message"
        },{status:500})
    }
}
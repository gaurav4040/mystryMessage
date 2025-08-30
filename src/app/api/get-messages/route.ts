import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET() {
    await dbConnect();

    //TODO TODO: REMOVE 
    
    const session = await getServerSession(authOptions)
    const user:User = session?.user
    
    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }
    
    const userId = new mongoose.Types.ObjectId(user._id)
    
    
    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        ])
        
        if(!user ){
            return Response.json({
                success:false,
                messages:"user not found"
            },{status:404})
        }
        if(user.length===0){
            return Response.json({
                success:false,
                message:"messages not found"
            },{status:404})
        }      
        return Response.json({
            success:true,
            messages:user[0].messages
        },{status:200})

    } catch (error) {
        console.log(`error in getting messages :===> `,error)
        return Response.json({
            success:false,
            message:"error in getting messages"
        },{status:500})
    }
}
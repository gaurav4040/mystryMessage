import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcrypt"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(req:Request):Promise<ApiResponse>{

    await dbConnect()

    try {
        
        const {username,email,password} = await req.json()

        const existingUserVerifiedByUsername = await userModel.findOne({
            username,
            isVerified:true
        })

        if(existingUserVerifiedByUsername){
            return {
                success:false,
                message:"user already exist",
                status:400
            }
        }

        const existingUserByEmail = await userModel.findOne({
            email
        })

        if(existingUserByEmail){

        }
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            return {
                success:true,
                message:"successfully registed new user",
                status:500
            }
        }
    } catch (error) {
        console.log(`Error registering new user  ${error}`)

        return {
            success:false,
            message:"failed in registering new user",
            status:500
        }
    }
}
import {resend} from '@/lib/resend'

import VerificationEmail from '../../emails/verificationEmail'

import { ApiResponse } from '@/types/ApiResponse'
import { any } from 'zod/v4'

export async function sendVerificationEmail(
    email:string,username:string,verifyCode:string
):Promise<ApiResponse>{
    
    try {
        await resend.emails.send({
            from:'jangragaurav593@gmail.com',
            to:email,
            subject: 'mystry message | verification code',
            react:VerificationEmail({username,otp:verifyCode})
        });
        return {success:true,message:'successfully send verification email'}
    } catch (emailError) {
        console.log(`error sending verification Email ${emailError}`)
        return {success:false,message:'failed to send verification email '}
    }
}
import emailjs from "emailjs-com";
import type { EmailJSResponseStatus } from "emailjs-com";

export async function sendVerificationEmail(
  email: string,
  username: string,
  purpose: string | null,
  verifyCode: string,
  time:string
): Promise<{ success: boolean; message: string }> {
  try {
    const response: EmailJSResponseStatus = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,   // 👈 must be NEXT_PUBLIC_ to work in browser
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      {
        to_email: email,
        username: username,
        otp: verifyCode,
        purpose,
        time
      },
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    console.log("Email sent:", response.status);

    if (response.status === 200) {
      return { success: true, message: "Email sent successfully" };
    } else {
      return { success: false, message: "Unexpected response from EmailJS" };
    }
  } catch (err) {
    console.error("Error sending email:", err);
    return { success: false, message: "Error sending verification email" };
  }
}






//! ANCHOR SEPRATE

// import Notify from "notifycx";
// import VerificationEmail from "../../emails/verificationEmail";
// import { ApiResponse } from "@/types/ApiResponse";

// // init Notify client
// const notify = new Notify(process.env.NOTIFY_API_KEY!);

// export async function sendVerificationEmail(
//   email: string,
//   username: string,
//   purpose: string | null,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     // render your React email into HTML
//     const emailHtml = VerificationEmail({
//       username,
//       otp: verifyCode,
//       purpose,
//     });

//     await notify.sendEmail({
//       to: email,
//       subject: "mystry message | verification code",
//       message: typeof emailHtml === "string" ? emailHtml : String(emailHtml), // Ensure string without using 'any'
//       name: username,     // optional, for personalization
//     });

//     return {
//       success: true,
//       message: "successfully sent verification email",
//     };
//   } catch (emailError) {
//     console.error(`error sending verification Email`, emailError);
//     return {
//       success: false,
//       message: "failed to send verification email",
//     };
//   }
// }





//! ANCHOR SEPRATE





// import {resend} from '@/lib/resend'

// import VerificationEmail from '../../emails/verificationEmail'

// import { ApiResponse } from '@/types/ApiResponse'

// export async function sendVerificationEmail(
//     email:string,username:string,purpose:string|null,verifyCode:string
// ):Promise<ApiResponse>{
    
//     try {
//         await resend.emails.send({
//             from:'jangragaurav593@gmail.com',
//             to:email,
//             subject: 'mystry message | verification code',
            
//             react:VerificationEmail({username,otp:verifyCode,purpose})
//         });
//         return {success:true,message:'successfully send verification email'}
//     } catch (emailError) {
//         console.log(`error sending verification Email ${emailError}`)
//         return {success:false,message:'failed to send verification email '}
//     }
// }
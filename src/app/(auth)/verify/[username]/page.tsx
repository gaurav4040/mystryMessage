"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {   REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

//TODO TODO:
// interface userProfileData{
//   username:string|null
//   email:string|null
//   password?:string|null
//   }

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams();
  
  const searchParams = useSearchParams()
  const userData={
    username:searchParams.get("username"),
    email:searchParams.get("email")
  }

  console.log('params is =====',params)

  //*zod implementation
  // const form = useForm<z.infer<typeof verifySchema>>({
  //   resolver: zodResolver(verifySchema),
  // });

 
    const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: {
        code: "",
      },
    })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

        if(response.data.success){
          toast.success(response.data.message);
          router.replace(`/profile?verification-status=true`)
        }
        else{
          toast.error(response.data.message)
        }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error in verify-code of user", error);
      toast.error(`error in verify-code ${axiosError.response?.data.message}`);
    }
  };


  //TODO TODO:
  const handleSendCodeAgain=async()=>{

    try {
      const response = await axios.post("/api/send-code-again",userData)

      if(response.data.success){
        toast.success("code sent again")
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log("error in code sent again",error)
      toast.error(" error in code sent again")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="w-full max-w-md p-8 space-y-8 bg-transparent  rounded-lg shadow-sm shadow-amber-500">
        <div className="text-center flex flex-row justify-center">
          <div>
            <h1 className="text-4xl bg-gradient-to-r from-blue-600 via-yellow-400 to-red-500 bg-clip-text text-transparent  font-extrabold tracking-light lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4 text-white">
              Enter the verification code , sent to your email
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  name="code"
                  control={form.control}
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP pattern={REGEXP_ONLY_DIGITS_AND_CHARS }  maxLength={6} {...field}>
                          <InputOTPGroup className="ml-15 text-white">
                            <InputOTPSlot index={0}  />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator className="text-white" />
                          <InputOTPGroup className="text-white">
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
            <div className="text-white mt-4">
              Didn&apos;t recived code ?<span><Button onClick={()=>handleSendCodeAgain()} className="ml-2 p-1 hover:text-blue-400">send again</Button></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

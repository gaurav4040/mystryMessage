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
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useSession } from "next-auth/react";

//TODO TODO:
// interface userProfileData{
//   username:string|null
//   email:string|null
//   password?:string|null
//   }

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const UpdateRequestUserData = {
    newusername: searchParams.get("newusername"),
  };
  const field = searchParams.get("field");

  console.log("params is =====", params);

  //*zod implementation
  // const form = useForm<z.infer<typeof verifySchema>>({
  //   resolver: zodResolver(verifySchema),
  // });

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(
        `/api/verify-code?newusername=${UpdateRequestUserData.newusername}`,
        {
          username: params.username,
          code: data.code,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        router.replace(
          `/profile?verification-status=true&&newusername=${UpdateRequestUserData.newusername}`
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error in verify-code of user", error);
      toast.error(`error in verify-code ${axiosError.response?.data.message}`);
    }
  };

  const [cooldown, setCooldown] = React.useState(0);

  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  //TODO TODO:
  const handleSendCodeAgain = async () => {
    const sendEmailData = {
      username: params.username,
      email: session?.user.email,
    };

    try {
      const response = await axios.post(
        `/api/send-code-again?purpose=${UpdateRequestUserData ? `New code For getting new username : "${UpdateRequestUserData.newusername}", verification code is : ` : ""}`,
        sendEmailData
      );

      if (response.data.success) {
        toast.success("code sent again");
        setCooldown(60);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("error in code sent again", error);
      toast.error(" error in code sent again");
    }
  };
  const handleSkipVerification =()=>{
    toast.success("skiped verification");
    router.replace('/signin');
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-amber-100">Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                          maxLength={6}
                          {...field}
                        >
                          <InputOTPGroup className="ml-15 text-white">
                            <InputOTPSlot index={0} />
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
                <Button type="submit" className="hover:text-green-400">Submit</Button>
              </form>
            </Form>
            <div className="text-blue-300 mt-4">
              Didn&apos;t recived code ?
              <span>
                <Button
                  onClick={() => handleSendCodeAgain()}
                  className="ml-2 p-1 hover:text-blue-400"
                >
                  {" "}
                  {cooldown > 0 ? `Send again in ${cooldown}s` : "Send again"}
                </Button>
              </span>
            </div>
            {field ==="signup" ? (
              <div className="text-gray-500 mt-4">
                verify later before 24 Hours or account will be deleted automatically
                <span>
                  <Button
                    onClick={() => handleSkipVerification()}
                    className="ml-2 pl-3 pr-3 hover:text-blue-400"
                  >
                   skip
                  </Button>
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader} from "lucide-react"


interface userSignUpData {
  email: string;
  username: string;
  password:string
}



const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 400);
  const router = useRouter();
  const searchParams = useSearchParams()
  const verificationStatus = searchParams.get("verification-status")
  let userData:userSignUpData;
  // *zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );

          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  if(verificationStatus==="true"){

    const signingUp =async ()=>{

      try {
        const response = await axios.post<ApiResponse>("/api/signup", userData);
        
        if(response.data.success){
          toast.success(response.data.message);
        }
        else{
          toast.error(response.data.message)
        }
 
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.error("Error in signup of user", error);
        toast.error( `error in signup ${axiosError.response?.data.message}`);
      } finally {
        setIsSubmitting(false);
      }
    }
    signingUp()
  }

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    userData=data;
    try {
      router.replace(`/verify/${username}?username=${data.username}&email=${data.email}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error in signup of user", error);
      toast.error( `error in signup ${axiosError.response?.data.message}`);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="w-full max-w-md p-8 space-y-8 text-yellow-500 rounded-lg shadow-md shadow-gray-400">
        <div className="text-center">
          <h1 className="text-4xl bg-gradient-to-r from-indigo-600 via-yellow-400 to-rose-600 text-transparent bg-clip-text font-extrabold tracking-tight lg:text-5xl mb-6">
            {" "}
            JOIN MYSTRY MESSAGE
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedUsername(e.target.value);
                      }}
                    />
                  </FormControl>
                  {
                    isCheckingUsername && <Loader className="animate-spin"/>
                  }
                  <p className={`text-sm ${usernameMessage === "username is unique"?'text-green-400':'text-red-400'}`}> {usernameMessage}</p>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />      
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
               type="submit" 
               disabled={isSubmitting}
               className="mx-1 w-full md:w-auto shadow-md shadow-gray-400 border-none  text-white bg-gradient-to-r from-gray-300 via-gray-600 to-gray-800 bg-[length:200%_100%] bg-right hover:bg-left transition-all ease-in-out duration-400  hover:text-black hover:border cursor-pointer"
              >
               {
                isSubmitting?(
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />Please wait
                  </>
                ):('SignUp')
               } 
               </Button>
          </form>
        </Form>
        <div className="text-center mt-4 text-gray-400">
          <p>
            Already a member?{' '}
            <Link href={"/signin"} className="text-blue-600 hover:text-blue-900 transition-all duration-400">
              SignIn 
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Page;

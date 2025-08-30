"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import Link from "next/link";
import {  useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader} from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";




const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // *zod implementation

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    // defaultValues: {
    //   identifier: "",
    //   password: "",
    // },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>):Promise<void> => {
    setIsSubmitting(true);

    try {
      const response = await signIn('credentials',{
        redirect:false,
        identifier:data.identifer,
        password:data.password
      })
      if(response?.error){
        toast.error("Incorrect credentials")
        console.log("error signin---------------------------------- ",response.error)
      }if(response?.url){
        toast.success("signin successfully")
        router.replace('/dashboard')
      }
 
    } catch (error) {
      console.error("Error in signup of user", error);
      toast.error(`error in signup ${error}`);
    } 
     finally {
       setIsSubmitting(false);
     }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="w-full max-w-md p-8 space-y-8 bg-transparent text-yellow-500 rounded-lg shadow-md shadow-gray-400">
        <div className="text-center">
          <h1 className="text-4xl bg-gradient-to-r from-indigo-600 via-yellow-400 to-rose-600 text-transparent bg-clip-text font-extrabold tracking-tight lg:text-5xl mb-6">
            {" "}
            JOIN MYSTRY MESSAGE
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifer"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Email/username"
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
               className=" shadow-md shadow-gray-400 bg-gradient-to-r text-white  from-gray-300 via-gray-600 to-gray-800 bg-[length:200%_100%]   bg-right hover:bg-left  hover:text-black transition-all ease-in-out duration-400"
              >
               {
                isSubmitting?(
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />Please wait
                  </>
                ):('SignIn')
               } 
               </Button>
          </form>
        </Form>
        <div className="text-center mt-4 text-gray-400">
          <p>
            Not a member?{' '}
            <Link href={"/signup"} className="text-blue-600 hover:text-blue-900 transition-all duration-400">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Page;


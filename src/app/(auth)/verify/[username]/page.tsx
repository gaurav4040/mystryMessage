'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function verifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  //*zod implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      if(response.data.success){
        toast.success(response.data.message)
      }
      router.replace('/signin');

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error in signup of user", error);
      toast.error( `error in verify-code ${axiosError.response?.data.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-300">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/20 rounded-lg shadow-lg">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-light lg:text-5xl mb-6">
                Verify Your Account
            </h1>
            <p className="mb-4">Enter the verification code , sent to your email</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    name="code"
                    control={form.control}
                    render={({field}) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter verification code" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                    />
                    <Button>Submit</Button>
                    </form>
                </Form>
        </div>
      </div>
    </div>
  );
}

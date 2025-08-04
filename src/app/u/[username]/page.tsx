"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { messageSchema } from "@/schemas/messageSchema";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Send } from "lucide-react";

export default function Page() {
  const { username } = useParams();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    const { content } = data;

    try {
      const response = await axios.post("/api/send-message", {
        username,
        content,
      });
      console.log("response==>>", response.data);
      if (response.data.success) {
        toast(response.data.message);
      }
    } catch (error) {
      console.log(`error in sending message page &&&& `, error);
      toast.error("some thing went wrong");
    }
  }

  const handleSuggestMessage=async ()=>{

    try {
      const response = await axios.post('/api/suggest-messages')
      
      console.log('response==>>>',response.data.message)
      if(response.data.success){
        toast.success("Here are your suggestion")
      }
    } catch (error) {
      console.log(`error in suggesting message page &&&& `, error);
      toast.error("some thing went wrong in message suggestion");
    }
  }

  return (
    <div className="w-full h-full flex flex-row justify-center min-h-screen bg-transparent  ">
      <div className="flex flex-col justify-center">
        <div className="h-full flex flex-col">
          <div className="mb-20">
            <h1 className="mt-10  text-3xl h-[60px] md:text-5xl font-bold bg-gradient-to-r from-fuchsia-600 via-amber-400 to-indigo-600 text-transparent bg-clip-text">
              Message Anyone Anonymously 🔗
            </h1>
            <div className="mt-10 shadow-sm/70 shadow-amber-400 p-6 rounded-lg">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg text-yellow-400">
                           Send Message To {" "}
                          <span className="font-bold bg-gradient-to-r from-indigo-600 via-rose-600 to-yellow-600 text-transparent bg-clip-text">
                            @{username}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your Message"
                            className="resize-none text-white w-[80vw]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="mt-2 ml-4 text-gray-300  font-bold bg-gradient-to-r from-yellow-300 via-yellow-600 to-black bg-[length:200%_100%]  bg-right hover:bg-left hover:text-black   transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    Send <Send />
                  </Button>
                  <h2 className="text-gray-400">
                    Know Some One else&apos;s username ? <br /> Try more fun <span className="text-2xl">↓</span>
                  </h2>
                  <Link href={"/sendmessage"}>
                    <Button
                      type="button"
                      className="mt-[-20px] ml-4 p-0 font-bold bg-gradient-to-r from-yellow-300 via-yellow-600 to-black bg-[length:200%_100%]  bg-right hover:bg-left hover:p-0 hover:text-lg transition-all duration-300 ease-in-out cursor-pointer "
                    >
                      <span className="p-3 hover:text-black bg-gradient-to-r from-blue-200 to-yellow-400 text-transparent bg-clip-text ">
                        Message Some One else
                      </span>
                    </Button>
                  </Link>
                </form>
              </Form>
            </div>
          </div>
          <div className="shadow-sm/70 shadow-amber-400 p-6 rounded-lg">
            <Button type="button" onClick={handleSuggestMessage} className="text-gray-300  font-bold bg-gradient-to-r from-yellow-300 via-yellow-600 to-black bg-[length:200%_100%]  bg-right hover:bg-left hover:text-black   transition-all duration-300 ease-in-out cursor-pointer" >Suggest Messages</Button>

          </div>
        </div>
      </div>
    </div>
  );
}

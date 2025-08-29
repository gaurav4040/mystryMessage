"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

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
import axios, { Axios } from "axios";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Send } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const { username } = useParams();
  const [suggestion, setSuggestion] = useState([]);
  const noSuggestionMessage =
    "No Suggestion click the button for Message Suggestion ";

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

    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(`error in sending message page &&&& `, err.response.data);
        toast.error(err.response.data);
      } else {
        console.log("An unexpected error occurred in sending message page", err);
        toast.error("An unexpected error occurred.");
      }
    }

  const handleSuggestMessage = async () => {
    try {
      const response = await axios.post("/api/suggest-messages");

      console.log("response==>>>", response.data.message);
      console.log("suggestion are===>>>>", response.data.message.split("||"));

      if (response.data.success) {
        toast.success("Here are your suggestion");
      }

      setSuggestion(response.data.message.split("||"));
    } catch (error) {
      console.log(`error in suggesting message page &&&& `, error);
      toast.error("some thing went wrong in message suggestion");
    }
  };
  const handleChooseSuggestionMessage = (suggestionMessage: string) => {
    form.setValue("content", suggestionMessage);
  };
  return (
    <div className="w-full h-full flex flex-row justify-center min-h-screen bg-transparent  ">
      <div className="flex flex-col justify-center">
        <div className="h-full flex flex-col">
          <div className="mb-20">
            <h1 className="mt-10  text-3xl h-[60px] md:text-5xl font-bold bg-gradient-to-r from-fuchsia-600 via-amber-400 to-indigo-600 text-transparent bg-clip-text">
              Message Anyone Anonymously 🔗
            </h1>
            <div className="mt-10 bg-gray-900 shadow-md shadow-gray-600 p-6 rounded-lg">
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
                        <FormLabel className="text-lg text-gray-300">
                          Send Message To{" "}
                          <span className="font-bold bg-gradient-to-r from-indigo-600 via-rose-600 to-yellow-600 text-transparent bg-clip-text">
                            @{username}
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your Message"
                            className="resize-none text-white w-[80vw] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="mt-2 ml-4 text-gray-300 shadow-md shadow-gray-600 font-bold bg-gradient-to-r from-white via-gray-800 to-gray-900 bg-[length:200%_100%]  bg-right hover:bg-left hover:text-black   transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    Send <Send />
                  </Button>
                  <h2 className="text-teal-400">
                    Know Some One else&apos;s username ?
                  </h2>
                  <Link href={"/send-message"}>
                    <Button
                      type="button"
                      className="mt-[-20px] ml-4 p-0 font-bold bg-gradient-to-r from-white via-gray-800 to-gray-900 bg-[length:200%_100%] shadow-md shadow-gray-600 bg-right hover:bg-left hover:p-0  transition-all duration-300 ease-in-out cursor-pointer "
                    >
                      <span className="p-3 hover:text-black bg-gradient-to-r from-white to-yellow-400 text-transparent bg-clip-text ">
                        Message Some One else
                      </span>
                    </Button>
                  </Link>
                </form>
              </Form>
            </div>
          </div>
          <div className="mb-10 bg-gray-900 shadow-md shadow-gray-600 p-6 rounded-lg">
            <Button
              type="button"
              onClick={handleSuggestMessage}
              className="text-gray-300 shadow-md shadow-gray-600 font-bold bg-gradient-to-r from-white via-gray-800 to-gray-900 bg-[length:200%_100%]  bg-right hover:bg-left hover:text-black   transition-all duration-300 ease-in-out cursor-pointer"
            >
              Suggest Messages
            </Button>
            <div className="mt-4 p-4 flex flex-col justify-between ">
              {suggestion.length > 0 ? (
                suggestion.map((suggestionMessage: string, index) => (
                  <>
                    <Button
                      onClick={() =>
                        handleChooseSuggestionMessage(suggestionMessage)
                      }
                      className=" text-yellow-100 border border-yellow-600/40 rounded-xl my-4 px-5 py-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl"
                    >
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          ease: "easeOut",
                        }}
                        className="  rounded-xl my-4 px-5 py-4 shadow-xl"
                      >
                        <motion.h1
                          className="text-base md:text-lg font-semibold tracking-wide flex flex-wrap gap-1"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: {
                              transition: {
                                staggerChildren: 0.05,
                              },
                            },
                          }}
                        >
                          {suggestionMessage
                            .split(" ")
                            .map((word, i) => (
                              <>
                                <motion.span
                                  key={i++}
                                  className="inline-block"
                                  variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0 },
                                  }}
                                >
                                  {word + " "}
                                </motion.span>
                              </>
                            ))}
                        </motion.h1>
                      </motion.div>
                    </Button>
                  </>
                ))
              ) : (
                <>
                  {console.log("here in else div")}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1 * 0.1,
                      ease: "easeOut",
                    }}
                    className=" text-red-400 border border-yellow-600/40  bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900   rounded-xl my-4 px-5 py-4 shadow-xl"
                  >
                    <motion.h1
                      className="text-base md:text-lg font-semibold tracking-wide flex flex-wrap gap-1  "
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                          },
                        },
                      }}
                    >
                      {noSuggestionMessage.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          className="inline-block"
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          {word + " "}
                        </motion.span>
                      ))}
                    </motion.h1>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

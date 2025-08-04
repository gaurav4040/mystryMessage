"use client";
//? ANCHOR  import { useCopyToClipboard } from "usehooks-ts";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptingMessageSchema } from "@/schemas/acceptingMessaageSchema";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";




export default function App() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptingMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptingMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptingMessages", response.data.isAcceptingMessage??false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessage = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);

      try {
        const response = await axios.get("/api/get-messages");

         //TODO TODO: REMOVE 
        console.log('fetch messsageResponse ==>>>',response.data.messages)

        setMessages(response.data.messages || []);

        if (refresh) {
          toast.loading("Showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch message "
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessage();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessage]);

  //* Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("api/accept-messages", {
        acceptMessages: !acceptMessages,
      });

      setValue('acceptingMessages', !acceptMessages);

      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to switch toggle acceptMessage "
      );
    }
  };

  const username = session?.user.username;

  //TODO TODO: do more research
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

 
  const CopyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("copied");
  };

  if (!session || !session.user) {
  
    return (
      <main className="min-h-[80vh] flex-grow flex flex-col items-center justify-center px-4 md:px-24 p-4 bg-transparent">
        <section className="text-center mb-8 md:mb-12">
          <div className=" flex flex-row items-center text-3xl h-[70px] md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text ">
            Get Started With Mystry Message →
            <span>
              <Link className="p-0" href={`/signin`}>
                <Button className=" ml-4 p-0 shadow-sm font-bold bg-gradient-to-r from-yellow-300 via-yellow-600 to-black bg-[length:200%_100%]  bg-right hover:bg-left transition-all duration-300  hover:text-lg ease-in-out cursor-pointer">
                  <span className=" p-3 hover:text-black bg-gradient-to-r from-sky-300 to-red-600 text-transparent bg-clip-text">
                    SignIn
                  </span>
                </Button>
              </Link>
            </span>
          </div>
          <p className=" mt-3 md:mt-4 text-base md:text-lg text-black/50">
            Explore Mystry Message - Where your identity remains a Secret
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="my-8 mx-4 shadow-sm shadow-amber-400 md:mx-8 lg:mx-auto p-6 bg-black rounded w-full max-w-6xl">
      <h1 className="text-4xl bg-gradient-to-r from-yellow-500 text-transparent bg-clip-text font-bold mb-4">
        {" "}
        User Dashboard
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-black">
          Copy Your Unique Link
        </h2>{" "}
        <div className="flex items-center">
          <Input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered border-white/30 border-2 rounded bg-black/80 w-full p-2 mr-2 text-white"
          />
          <Button
            className="h-[45px] shadow-sm shadow-amber-300 bg-black/80  text-yellow-400 hover:bg-yellow-400 hover:text-black"
            onClick={CopyToClipboard}
          >
            copy
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch
          {...register("acceptingMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span
          className={`ml-2 ${acceptMessages ? "text-yellow-400" : "text-gray-400"}`}
        >
          Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessage(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4 bg-white/70" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message:Message) => (
            <MessageCard
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-red-400">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

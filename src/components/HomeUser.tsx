"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import AutoPlay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useBaseUrl } from "@/context/BaseUrlContext";




export default function HomeUser() {
  const { data: session } = useSession();
  const baseUrl = useBaseUrl();
  const username = session?.user.username;
  const profileUrl =  `${baseUrl}/u/${username}`;
  
    return (
      <>
        <main className="flex-grow py-10 flex flex-row items-center justify-center px-4 md:px-24 p-4 bg-transparent">
          <section className="h-[40vh] flex flex-col justify-between text-center mb-8 md:mb-12">
            <h1 className="mb-2 text-3xl h-[60px] md:text-5xl font-bold text-white ">
              Welcome,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text ">
                {username}
              </span>{" "}
              Dive Into Mystry World of Anonymous Conversation <br />↓
            </h1>

            <Link href={`${profileUrl}`} className=" mb-10">
              <Button className="p-0 shadow-md shadow-gray-400 font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-300 bg-[length:200%_100%]  bg-right hover:bg-left transition-all duration-300 ease-in-out cursor-pointer ">
                <span className=" hover:bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text hover:text-transparent text-black p-3 ">
                  Click To Send Anonymous Message
                </span>
              </Button>
            </Link>
          </section>

          <Carousel
            plugins={[AutoPlay({ delay: 2000 })]}
            className="w-full  max-w-lg bg-transparent"
          >
            <CarouselContent className="-ml-1 w-[150%] bg-transparent">
              {messages.map((message, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/2 lg:basis-1/3 bg-transparent"
                >
                  <div className="p-1">
                    <Card className="bg-gradient-to-r from-gray-900 via-gray-black to-gray-900 border-none shadow-sm shadow-gray-400">
                      <CardHeader className="font-bold text-gray-600">
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-lg font-semibold text-fuchsia-800">
                          {message.content}
                        </span>
                      </CardContent>
                      <CardFooter className="text-gray-400">
                        {message.received}
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </main>
      </>
    );
  }


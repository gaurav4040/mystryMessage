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


export default function Home() {
  const {data:session} = useSession();

  const baseUrl =useBaseUrl()
  let profileUrl=''
  const username = session?.user.username


  if( !session || !session?.user){
    //TODO  TODO:  REMOVE 
    console.log('here in main home page NOT session ',baseUrl)

     profileUrl =`${baseUrl}/signin`

     return (
      <>
        <main className="min-h-[80vh] flex-grow flex flex-col items-center justify-center px-4 md:px-24 p-4 bg-transparent">
          <section className="text-center mb-8 md:mb-12">
            <h1
              className="text-3xl h-[60px] md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-yellow-300 to-rose-600 text-transparent bg-clip-text "
            >
              Dive Into Mystry World of Anonymous Conversation
            </h1>
            <p className=" mt-3 md:mt-4 text-base md:text-lg text-black/50">
              Explore Mystry Message - Where your identity remains a Secret
            </p>
            <p className="mt-3 text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text">
              ↓
            </p>
          </section>
  
  
           <Link href={`${profileUrl}`}>
            <Button  className="mt-[-20px] p-0 mb-10 shadow-sm font-bold bg-gradient-to-r from-yellow-300 via-yellow-600 to-black bg-[length:200%_100%]  bg-right hover:bg-left transition-all duration-300 ease-in-out cursor-pointer  hover:text-lg" >
              <span className="p-2 hover:text-black bg-gradient-to-r from-sky-300 to-rose-600 text-transparent bg-clip-text">SignIn To Explore</span>
            </Button>
           </Link>      
  
  
        </main>
      </>
    );
  
  }
  else{
    //TODO  TODO:  REMOVE 
    console.log('here in main homepage session part')
     profileUrl = `${baseUrl}/u/${username}`

     return (
      <>
        <main className="flex-grow py-10 flex flex-row items-center justify-center px-4 md:px-24 p-4 bg-transparent">
          <section className="h-[40vh] flex flex-col justify-between text-center mb-8 md:mb-12">
            <h1
              className="mb-2 text-3xl h-[60px] md:text-5xl font-bold text-white "
            >
              Welcome, <span className="bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text ">{username}</span> Dive Into Mystry World of Anonymous Conversation <br/>↓
            </h1>
           
            <Link href={`${profileUrl}`} className=" mb-10">
            <Button  className="p-0 shadow-sm font-bold bg-gradient-to-r from-yellow-300 via-gray-700 to-gray-900 bg-[length:200%_100%]  bg-right hover:bg-left transition-all duration-300 ease-in-out cursor-pointer " >
              <span className=" bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent hover:text-black p-3 ">Click To Send Anonymous Message</span>
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
                    <Card className="bg-gradient-to-r from-gray-900 via-gray-black to-gray-900 border-none shadow-sm shadow-amber-500">
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
  
}

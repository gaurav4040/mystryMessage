"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { YieldCard } from "./ui/yield-card";
import feature from "@/feature.json";
import working from "@/working.json";
import { useBaseUrl } from "@/context/BaseUrlContext";
import AutoPlay from "embla-carousel-autoplay";

interface working{
    steps:string;
    header:string;
    content:string
  }

export default function HomeNotUser() {

  const baseUrl = useBaseUrl();
  let profileUrl = "";
  profileUrl = `${baseUrl}/signin`;

  return (
    <>
      <div className="min-h-[80vh] flex-row flex items-center justify-center px-4 md:px-24 p-4 bg-transparent">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl h-[110px] md:text-5xl font-bold bg-gradient-to-r from-gray-600 via-white to-gray-600 text-transparent bg-clip-text ">
            Dive Into <span className="text-3xl h-[fit] md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-yellow-400  to-red-600 text-transparent bg-clip-text ">
              Mystry World 🌐
            </span> of Anonymous Messages
          </h1>
          <p className=" mt-3 md:mt-4 text-base md:text-lg text-black/50">
            Explore Mystry Message - Where your identity redivs a Secret
          </p>
          <p className="mt-[-20px] text-3xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text">
            ↓
          </p>
          <Link href={`${profileUrl}`}>
            <Button className="mt-[20px] p-0 mb-10 shadow-md shadow-gray-600 font-bold bg-gradient-to-r from-gray-300 via-gray-600 to-gray-900 bg-[length:200%_100%]  bg-right hover:bg-left transition-all duration-300 ease-in-out cursor-pointer  hover:text-lg">
              <span className="p-2 hover:text-black bg-gradient-to-r from-sky-600 via-white to-rose-600 text-transparent bg-clip-text">
                SignIn To Explore
              </span>
            </Button>
          </Link>
        </section>

        <Carousel
          plugins={[AutoPlay({ delay: 2000 })]}
          className="w-full max-w-xs "
        >
          <CarouselContent>
            {feature.map((feature, index) => (
              <CarouselItem key={index} className="bg-black  ">
                <div className="  p-1">
                  <div>
                    <Card className="bg-black h-[450px] border-none">
                      <div className="h-[300px]">
                        <Image
                          src={feature.imageLink}
                          alt={feature.header}
                          width={feature.header === "Secure" ? "200" : "250"}
                          height={80}
                          className={`${feature.header === "Secure" ? "ml-[4vw]" : "ml-[2vw]"} rounded-3xl mb-3 `}
                        />
                      </div>
                      <CardContent className=" font-bold bg-gradient-to-r from-gray-700 via-gray-400 to-gray-900 bg-clip-text text-transparent text-3xl items-center justify-center p-6">
                        {feature.header}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="w-full flex flex-row justify-center">
        <h1 className="mb-10 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-700 bg-clip-text text-transparent font-bold text-4xl">
          How It Works
        </h1>
      </div>
      <div className="w-full flex flex-row justify-center">
        {working.map((working: working, index) => (
          <YieldCard key={index} message={working} />
        ))}
      </div>
      
    </>
  );
}

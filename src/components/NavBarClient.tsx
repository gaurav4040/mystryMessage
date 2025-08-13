"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { usePathname, useRouter } from "next/navigation";
import { useBaseUrl } from "@/context/BaseUrlContext";

export default function NavBarClient() {
  const { data: session } = useSession();
  const baseUrl = useBaseUrl()
  const router = useRouter();
  const pathName = usePathname();
  const handleMystryLink = () => {
    router.replace("/");
  };

  return (
    <nav className="bg-black  p-4 md:p-6 shadow-2xl shadow-yellow-400 ">
      <div className=" container min-h-fit mx-auto flex flex-col md:flex-row justify-between items-center">
        <a
          className="text-2xl font-extrabold mb-4 md:mb-0 bg-gradient-to-r bg-gradient-to-r from-indigo-600 via-yellow-400 to-rose-600 text-transparent bg-clip-text cursor-pointer select-none"
          onClick={handleMystryLink}
        >
          Mystry Message 🪄
        </a>
        {session ? (
          <div>
            {`${baseUrl}${pathName}` !== `${baseUrl}/dashboard` ? (
              <Link href={"/dashboard"}>
                <Button className="mt-2 mr-2 p-4 shadow-md border border-white shadow-gray-400 font-bold bg-black hover:bg-white  transition-all duration-900 ease-in-out cursor-pointer">
                  <span className="bg-white/10 bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text">
                    Dashboard
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href={"/profile"}>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="mt-2 mr-2 p-4 shadow-md border border-white shadow-gray-400 font-bold bg-black hover:bg-white  transition-all duration-900 ease-in-out cursor-pointer">
                      <span className="bg-white/10 bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text">
                        Profile
                      </span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex justify-between gap-4">
                      <Avatar>
                        <AvatarImage src="https://github.com/vercel.png" />
                        <AvatarFallback>VC</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{session.user?.username}</h4>
                          {/* //TODO TODO:  TO BE SEEN */}
                        <p className="text-sm">
                          The React Framework – created and maintained by
                          @vercel.
                        </p>
                        <div className="text-muted-foreground text-xs">
                          Joined December 2021
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </Link>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="cursor-pointer text-bold w-full md:w-auto border text-red-500 border-red-500  bg-black hover:bg-red-500 transition-all ease-in-out duration-400 hover:text-black  "
                >
                  Sign Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. To Send Message You have to
                    SignIn again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="w-full md:w-auto border-none bg-green-600 hover:bg-green-800 transition-all ease-in-out duration-700 hover:text-white shadow-md shadow-gray-400">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>{ signOut(); router.refresh()}}
                    className="w-full md:w-auto border border-white bg-black hover:bg-red-500 transition-all ease-in-out duration-700 hover:text-white shadow-md shadow-gray-400"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div>
            {`${baseUrl}${pathName}` !== `${baseUrl}/signin` ? (
              <Link href={"/signin"}>
                <Button className="mx-1 w-full md:w-auto  text-white bg-gradient-to-r from-gray-300 via-gray-600 to-gray-800 bg-[length:200%_100%] bg-right hover:bg-left transition-all ease-in-out duration-400 hover:text-black shadow-md shadow-gray-400 cursor-pointer">
                  Sign in
                </Button>
              </Link>
            ) : null}
            {`${baseUrl}${pathName}` !== `${baseUrl}/signup` ? (
              <Link href={"/signup"}>
                <Button className="mx-1 w-full md:w-auto shadow-md shadow-gray-400 border-none  text-white bg-gradient-to-r from-gray-300 via-gray-600 to-gray-800 bg-[length:200%_100%] bg-right hover:bg-left transition-all ease-in-out duration-400  hover:text-black hover:border cursor-pointer">
                  Sign up
                </Button>
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}

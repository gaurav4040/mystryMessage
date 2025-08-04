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

// import { headers } from "next/headers";
// import {useLocation} from "react-router-dom"
// import absoluteUrl from 'next-absolute-url';

export default function NavBarClient({ baseUrl }: { baseUrl: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const handleMystryLink = () => {
    router.replace("/");
  };

  //! console.log(`homeurl===>${homeUrl} &&& currUrl===>${baseUrl}${currUrl}`)

  //* const homeUrl = `${window.location.protocol}//${window.location.host}`

  //*  const {origin} = new URL(useLocation().href)
  //* const {origin} = absoluteUrl(req)

  //* const hdrs = headers();
  //* const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
  //* const proto = hdrs.get("x-forwarded-proto") ?? "https";
  //* const origin = `${proto}://${host}`;

  return (
    <nav className="bg-transparent  p-4 md:p-6 shadow-2xl shadow-yellow-400/30 ">
      <div className="bg-transparent  container min-h-fit mx-auto flex flex-col md:flex-row justify-between items-center">
        <a
          className="text-2xl font-extrabold mb-4 md:mb-0 bg-gradient-to-r from-yellow-500  via-amber-600 to-sky-300 text-transparent bg-clip-text cursor-pointer select-none"
          onClick={handleMystryLink}
        >
          Mystry Message 🪄
        </a>
        {session ? (
          <div>
            {`${baseUrl}${pathName}` !== `${baseUrl}/dashboard` ? (
              <Link href={"/dashboard"}>
                <Button className="mt-2 mr-2 p-4 shadow-sm font-bold bg-gradient-to-r from-blue-200 via-white to-white bg-[length:200%_100%]  bg-right hover:bg-left transition-all duration-300 ease-in-out cursor-pointer">
                  <span className="bg-white/10 bg-gradient-to-r from-indigo-600 to-rose-600 text-transparent bg-clip-text">
                    Dashboard
                  </span>
                </Button>
              </Link>
            ) : (
              <Link href={"/profile"}>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button className="mt-2 mr-2 p-4 shadow-sm font-bold bg-gradient-to-r from-blue-200 via-white to-white bg-[length:200%_100%]  bg-right hover:bg-left transition-all duration-300 ease-in-out cursor-pointer">
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
                  className="cursor-pointer w-full md:w-auto bg-gradient-to-r from-red-600 via-red-100 to-white bg-[length:200%_100%]  text-red-600 bg-right hover:bg-left transition-all ease-in-out duration-400 hover:text-white shadow-sm "
                >
                  Sign Out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. To Send Message You have to
                    SignIn again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="w-full md:w-auto bg-gradient-to-r from-blue-600 via-white to-white bg-[length:200%_100%]  text-blue-600 bg-right hover:bg-left transition-all ease-in-out duration-400 hover:text-white shadow-sm">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => signOut()}
                    className="w-full md:w-auto bg-gradient-to-r from-red-600 via-red-100 to-white bg-[length:200%_100%]  text-red-600 bg-right hover:bg-left transition-all ease-in-out duration-400 hover:text-white shadow-sm"
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
                <Button className="mx-1 w-full md:w-auto  text-black bg-gradient-to-r from-yellow-400 via-yellow-400 to-amber-600 bg-[length:200%_100%] bg-right hover:bg-left transition-all ease-in-out duration-400 hover:text-black shadow-sm cursor-pointer">
                  Sign in
                </Button>
              </Link>
            ) : null}
            {`${baseUrl}${pathName}` !== `${baseUrl}/signup` ? (
              <Link href={"/signup"}>
                <Button className="mx-1w-full md:w-auto border border-yellow-400  text-yellow-100 bg-gradient-to-r from-yellow-400 via-yellow-400 to-black bg-[length:200%_100%] bg-right hover:bg-left transition-all ease-in-out duration-400  hover:text-black hover:border cursor-pointer">
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

"use client"

import HomeNotUser from "@/components/HomeNotUser";
import HomeUser from "@/components/HomeUser";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (!session || !session?.user) {
    return <HomeNotUser />;
  } else {
    return <HomeUser />;
  }
}

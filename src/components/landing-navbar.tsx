"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const font = Montserrat({ weight: "600", subsets: ["latin"] });

export const LandingNavbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <nav className="p-4 bg-transparent flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <div
          onClick={() => router.push("/board")}
          className="relative h-8 w-8 mr-4"
        >
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <h1 className={cn("text-2xl font-bold text-white", font.className)}>
          Tasker
        </h1>
      </Link>
      <div className="flex items-center gap-x-2">
        <Link href={isSignedIn ? "/board" : "/sign-up"}>
          <Button
            variant="outline"
            className="text-white hover:text-black hover:bg-white rounded-full"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

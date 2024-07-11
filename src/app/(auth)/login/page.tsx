"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserAuthForm } from "./components/loginForm";

function LoginPage() {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900">
          <div className="relative w-full h-full mx-auto">
            <Image
              src="/bg-3.jpg"
              layout="fill"
              className="rounded-t-md bg-cover"
              alt="News"
            />
          </div>
        </div>
      </div>
      <div className="lg:p-8 relative">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center items-center gap-2">
            <Link href="/" className="z-20 flex">
              <Image src="/dentistry.svg" alt="logo" width={150} height={150} />
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Dentistry
            </h1>
            <p className="text-sm text-muted-foreground">Login to continue</p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

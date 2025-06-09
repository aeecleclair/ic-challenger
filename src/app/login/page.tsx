"use client";

import * as React from "react";
import { Card, CardContent } from "../../components/ui/card";
import MyECLButton from "../../components/login/MyECLButton";
import Link from "next/link";
import Image from "next/image";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/src/components/login/LoginForm";

const Login = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-8 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            MyECL Challenger
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
        <div className="text-muted-foreground text-center text-sm text-balance mt-auto">
          En vous connectant, vous acceptez nos{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Conditions d&apos;utilisation
          </a>{" "}
          et notre{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Politique de confidentialité
          </a>
          .
        </div>
      </div>
      <div className="relative hidden lg:block py-[3vh] pr-[3vh]">
        <div className="bg-muted h-full rounded-xl overflow-hidden"></div>
      </div>
    </div>
  );
};

export default Login;

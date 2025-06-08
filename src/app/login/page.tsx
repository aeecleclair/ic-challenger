"use client";

import * as React from "react";
import { Card, CardContent } from "../../components/ui/card";
import MyECLButton from "../../components/login/MyECLButton";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex flex-col w-full max-w-[800px] mx-auto min-h-[90vh] justify-center p-4 sm:p-8">
      <Card className="overflow-hidden p-0 shadow-xl border-0 sm:border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 sm:p-8 md:p-12 lg:p-16">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold mb-6">Se connecter</h1>
                <p className="text-muted-foreground text-balance text-lg max-w-xs">
                  Si vous possédez déjà un compte MyECL, vous pouvez vous
                  connecter avec.
                </p>
              </div>

              <div className="grid gap-8">
                <MyECLButton />
              </div>

              <div className="grid gap-6 mt-4">
                <div className="text-center text-base">
                  Vous n&apos;avez pas de compte ?{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4 font-medium text-primary hover:text-primary/80"
                  >
                    Créer un compte
                  </Link>
                </div>
                <div className="text-center text-base">
                  <Link
                    href="/recover"
                    className="underline underline-offset-4 text-gray-600 hover:text-gray-800"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </div>
          </form>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 relative hidden md:block">
            <div className="absolute inset-0 bg-opacity-20 bg-black backdrop-blur-sm z-10"></div>
            <Image
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-40"
              fill
              sizes="(max-width: 768px) 0vw, 50vw"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-white text-center p-8">
                <h2 className="text-3xl font-bold mb-4">Bienvenue</h2>
                <p className="text-xl opacity-90">
                  Plateforme d&apos;inscription
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-sm text-balance *:[a]:underline *:[a]:underline-offset-4 mt-4">
        En vous connectant, vous acceptez nos{" "}
        <a href="#">Conditions d&apos;utilisation</a> et notre{" "}
        <a href="#">Politique de confidentialité</a>.
      </div>
    </div>
  );
};

export default Login;

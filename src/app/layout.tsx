"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "../components/ui/toaster";
import { toast } from "../components/ui/use-toast";
import { Suspense } from "react";
import { ThemeProvider } from "../components/ui/theme";
import { useTokenStore } from "../stores/token";
import Script from "next/script";

const inter = Outfit({ subsets: ["latin-ext"] });

function handleGlobalQueryError(error: unknown) {
  const status =
    error && typeof error === "object" && "status" in error
      ? (error as { status: number }).status
      : null;

  if (status === 401) {
    // 401 = unauthenticated (token expired/invalid) → clear tokens and redirect
    // Note: 403 = forbidden (valid token but insufficient permissions) → do NOT logout
    const { setToken, setRefreshToken } = useTokenStore.getState();
    setToken(null);
    setRefreshToken(null);
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
    }
    return;
  }
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalQueryError,
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Challenger</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>

      <Script
        defer
        data-domain="challenger.myecl.fr"
        src="https://plausible.eclair.ec-lyon.fr/js/script.js"
        strategy="lazyOnload"
      />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <QueryClientProvider client={queryClient}>
              {children}
              <Toaster />
            </QueryClientProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

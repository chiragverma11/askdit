"use client";

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProvidersProps extends ThemeProviderProps {
  children: ReactNode;
}

const queryClient = new QueryClient()

const Providers: FC<ProvidersProps> = ({ children }) => {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem><QueryClientProvider client={queryClient}>
        {children}</QueryClientProvider>
      </NextThemesProvider>
    </SessionProvider>
  );
};

export default Providers;

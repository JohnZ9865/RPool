import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SESSION_COOKIE_NAME } from "@/constant";
import { cookies } from "next/headers";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Firebase Next.js Hackpack",
  description: "Firebase Setup Integration with Next.js",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value || null;

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />

        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}

const SessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: string | null;
}) => {
  return React.cloneElement(children as any, { session });
};

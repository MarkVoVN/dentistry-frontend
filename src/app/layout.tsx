import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/shared/Header";

import "@/styles/globals.css";
import QueryProvider from "@/components/provider/QueryProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memora",
  description: "Memora makes memmorization easy with flashcard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
          position="bottom-right"
          containerStyle={{
            zIndex: "60 !important",
          }}
          containerClassName="react-hot-toast-container z-[60]"
          toastOptions={{
            className: "react-hot-toast z-60",
            style: {
              zIndex: "60 !important",
            },
            // duration: 50000,
          }}
          reverseOrder={false}
        />
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/shared/Header";

import "@/styles/globals.css";
import QueryProvider from "@/components/provider/QueryProvider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/shared/Footer";
import { GlobalStoreProvider } from "@/lib/store/global/provider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dentistry",
  description: "Make appointments with the best dentists in the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"absolute w-[100vw]"}>
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
          <GlobalStoreProvider>
            <Header />
            {children}
            <Footer />
          </GlobalStoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

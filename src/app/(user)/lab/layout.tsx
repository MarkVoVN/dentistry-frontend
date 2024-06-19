"use client";

import { GlobalStoreProvider } from "@/lib/store/global/provider";
import TestSidebar from "./components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* <Toaster
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
        /> */}
      <div className="bg-neutral-2 dark:bg-[#57606b]">
        <div className="flex h-screen overflow-hidden">
          <TestSidebar />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <main>
              <div className="">
                <GlobalStoreProvider>{children}</GlobalStoreProvider>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

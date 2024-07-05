"use client";
import QueryProvider from "@/components/provider/QueryProvider";
import { GlobalStoreProvider } from "@/lib/store/global/provider";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

// import { refreshToken } from "@/lib/api/authenAPI";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./admin/components/Header";
import Sidebar from "./admin/components/Sidebar";
import Loader from "./admin/components/loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const refreshTokenStorage = localStorage.getItem("refreshToken");
    // if (refreshTokenStorage != null) {
    //   refreshToken(refreshTokenStorage).then(({ data, error }) => {
    //     if (error != null) {
    //       // toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
    //       router.push("/authentication/login");
    //       return;
    //     }
    //     if (data != null) {
    //       const { accessToken, refreshToken } = data;
    //       if (accessToken != null) {
    //         localStorage.setItem("accessToken", accessToken);
    //       }
    //       if (refreshToken != null) {
    //         localStorage.setItem("refreshToken", refreshToken);
    //       }
    //     }
    setLoading(false);
    //   });
    // } else {
    //   router.push("/authentication/login");
    // }
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <QueryProvider>
          <GlobalStoreProvider>
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
            <div className="bg-neutral-2 dark:bg-[#57606b]">
              {loading ? (
                <Loader />
              ) : (
                <div className="flex h-screen overflow-hidden">
                  {/* <!-- ===== Sidebar Start ===== --> */}
                  <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  {/* <!-- ===== Sidebar End ===== --> */}

                  {/* <!-- ===== Content Area Start ===== --> */}
                  <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                      <div className="mx-auto max-w-screen-2xl p-2 sm:p-4 md:p-6 2xl:p-10 dark:text-shade-1-100% text-[#1C2434]">
                        {children}
                      </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                  </div>
                  {/* <!-- ===== Content Area End ===== --> */}
                </div>
              )}
            </div>
          </GlobalStoreProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

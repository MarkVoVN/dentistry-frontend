"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/ui/loading";
import { refreshToken } from "@/lib/api/userAPI";

export function withPublic(Component: any) {
  return function WithPublic(props: any) {
    useEffect(() => {
      const initialize = async () => {
        try {
          const accessTokenCheck = localStorage.getItem("accessToken");
          if (accessTokenCheck == null) return;

          refreshToken(accessTokenCheck)
            .then((response: any) => {
              // setCurrentUser(response?.data);
            })
            .catch((err: any) => {
              console.log(err);
            });
        } catch (err: any) {
          console.log(err.message);
        }
      };
      initialize();
    }, []);

    const router = useRouter();

    return <Component {...props} />;
  };
}

export function withProtected(Component: any) {
  return function WithProtected(props: any) {
    const router = useRouter();

    useEffect(() => {
      const initialize = async () => {
        try {
          const accessTokenCheck = localStorage.getItem("accessToken");
          if (accessTokenCheck == null) {
            router.replace("/authentication/login");
            return <Loading></Loading>;
          }
          refreshToken(accessTokenCheck)
            .then((response: any) => {
              // setCurrentUser(response?.data);
              return response?.data;
            })
            .then((user) => {
              if (!user) {
                router.replace("/authentication/login");
                return <Loading></Loading>;
              }
            })
            .catch((err: any) => {
              console.log(err);
            });
        } catch (err: any) {
          console.log(err.message);
        }
      };
      initialize();
    }, []);

    return <Component {...props} />;
  };
}

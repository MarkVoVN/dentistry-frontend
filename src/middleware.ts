import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (token) {
    try {
      const decoded = jwt.decode(token!) as JwtPayload;
      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      if (
        role === "Customer" &&
        (request.nextUrl.pathname.startsWith("/dentist") ||
          request.nextUrl.pathname.startsWith("/admin") ||
          request.nextUrl.pathname.startsWith("/clinicowner"))
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      } else if (
        role === "Dentist" &&
        !request.nextUrl.pathname.startsWith("/dentist")
      ) {
        return NextResponse.redirect(new URL("/dentist", request.url));
      } else if (
        role === "ClinicOwner" &&
        !request.nextUrl.pathname.startsWith("/clinicowner")
      ) {
        return NextResponse.redirect(new URL("/clinicowner", request.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

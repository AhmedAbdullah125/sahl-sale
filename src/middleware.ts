// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/profile", "/add-ad"];
const AUTH_PAGES = ["/login"]; // add "/register" if you have it

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const token = request.cookies.get("token")?.value;
    console.log(token);


    const isProtected = PROTECTED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    const isAuthPage = AUTH_PAGES.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    // ✅ If user is logged in, block /login (send to home or profile)
    if (token && isAuthPage) {
        const url = new URL("/profile", request.url); // or "/"
        return NextResponse.redirect(url);
    }

    // ✅ If route is protected and no token => go login + keep redirect
    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname + (search || ""));
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile", "/profile/:path*", "/add-ad", "/add-ad/:path*", "/login"],
};
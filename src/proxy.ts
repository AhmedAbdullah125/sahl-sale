// proxy.ts
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/profile", "/add-ad", "/add-auction"];
const AUTH_PAGES = ["/login"];

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const token = request.cookies.get("token")?.value;

    const isProtected = PROTECTED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    const isAuthPage = AUTH_PAGES.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
    );

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (isProtected && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname + (search || ""));
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile",
        "/profile/:path*",
        "/add-ad",
        "/add-ad/:path*",
        "/add-auction",
        "/add-auction/:path*",
        "/login",
    ],
};
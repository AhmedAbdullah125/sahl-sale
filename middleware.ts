import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/profile"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PATHS.some(
        (path) => pathname === path || pathname.startsWith(path + "/")
    );

    const res = NextResponse.next();
    res.headers.set("x-mw-ran", "1");
    res.headers.set("x-mw-path", pathname);

    if (!isProtected) return res;

    const token = request.cookies.get("token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return res;
}

export const config = {
    matcher: ["/profile/:path*"],
};

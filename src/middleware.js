import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
        await jwtVerify(token, SECRET);
        return NextResponse.next();
    } catch (err) {
        console.error("Token inválido ou expirado: ", err);
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: [
        "/callback/:path*",
        "/dashboard/:path*",
        "/get-shop-profile/:path*",
        "/integrate/:path*",
        "/products/:path*",
        "/profit/:path*",
        "/support/:path*",
        "/taxes/:path*",
    ],
};

import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/stores', '/analytics', '/settings'];
const publicPrefixRoutes = ['/payments']; // префиксные публичные

const publicExactRoutes = ['/', '/auth'];

export default function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isPublicPrefixRoute = publicPrefixRoutes.some((route) => path.startsWith(route));
    const isPublicExactRoute = publicExactRoutes.includes(path);

    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (isProtectedRoute) {
        if (!refreshToken) {
            return NextResponse.redirect(new URL('/auth', req.nextUrl));
        }
        return NextResponse.next();
    }

    // /, /auth и ВСЁ под /payments/... считаем публичным
    if (isPublicExactRoute || isPublicPrefixRoute) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};

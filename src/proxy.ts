import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/analytics', '/settings', '/stores'];
const publicRoutes = ['/auth-service'];

export default async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    const refreshToken = req.cookies.get('refresh_token')?.value;
    const accessToken = req.cookies.get('access_token')?.value;

    if (isProtectedRoute) {
        if (!refreshToken) {
            const response = NextResponse.redirect(new URL('/auth-service', req.nextUrl));
            response.cookies.delete('refresh_token');
            response.cookies.delete('access_token');
            return response;
        }

        let isAccessTokenValid = false;
        if (accessToken) {
            try {
                const [, payload] = accessToken.split('.');
                const decodedPayload = JSON.parse(
                    Buffer.from(payload, 'base64').toString('utf-8')
                );
                const exp = decodedPayload.exp;
                const now = Math.floor(Date.now() / 1000);

                isAccessTokenValid = exp > now;
            } catch (error) {
                console.error('Error decoding access token:', error);
                isAccessTokenValid = false;
            }
        }

        if (!accessToken || !isAccessTokenValid) {
            try {
                const backendUrl = 'http://localhost:8000';
                const response = await fetch(`${backendUrl}/auth/update_session`, {
                    method: 'POST',
                    headers: {
                        'Cookie': `refresh_token=${refreshToken}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const redirectResponse = NextResponse.redirect(new URL('/auth-service', req.nextUrl));
                    redirectResponse.cookies.delete('refresh_token');
                    redirectResponse.cookies.delete('access_token');
                    return redirectResponse;
                }

                const setCookieHeader = response.headers.get('set-cookie');

                if (!setCookieHeader) {
                    const redirectResponse = NextResponse.redirect(new URL('/auth-service', req.nextUrl));
                    redirectResponse.cookies.delete('refresh_token');
                    redirectResponse.cookies.delete('access_token');
                    return redirectResponse;
                }

                const nextResponse = NextResponse.next();

                nextResponse.cookies.delete('access_token');

                const cookies = setCookieHeader.split(/,(?=[^;]+?=)/).map(c => c.trim());

                cookies.forEach(cookieString => {
                    const parts = cookieString.split(';').map(p => p.trim());
                    const [nameValue] = parts;
                    const [name, value] = nameValue.split('=');

                    if (name && value) {
                        const cookieName = name.trim();
                        const cookieValue = value.trim();

                        let maxAge = 300;
                        const maxAgeAttr = parts.find(p => p.toLowerCase().startsWith('max-age='));
                        if (maxAgeAttr) {
                            maxAge = parseInt(maxAgeAttr.split('=')[1]);
                        }

                        nextResponse.cookies.set(cookieName, cookieValue, {
                            httpOnly: true,
                            path: '/',
                            sameSite: 'lax',
                            secure: process.env.NODE_ENV === 'production',
                            maxAge: maxAge,
                        });
                    }
                });

                return nextResponse;

            } catch (error) {
                console.error('Error updating session in middleware:', error);
                const redirectResponse = NextResponse.redirect(new URL('/auth-service', req.nextUrl));
                redirectResponse.cookies.delete('refresh_token');
                redirectResponse.cookies.delete('access_token');
                return redirectResponse;
            }
        }
    }

    if (isPublicRoute && refreshToken) {
        return NextResponse.redirect(new URL('/stores', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
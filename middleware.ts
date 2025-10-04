import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/login',
    '/api/webhooks/clerk'
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    // If user is not signed in and trying to access protected route
    if (!isPublicRoute(req) && !userId) {
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // If user is signed in and trying to access login page, redirect to dashboard
    if (userId && req.nextUrl.pathname === '/login') {
        const dashboardUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}, {
    clockSkewInMs: 60000
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
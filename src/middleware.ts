// import { getToken } from 'next-auth/jwt';
// import { withAuth } from 'next-auth/middleware';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { has } from "./app/actions"
export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    const cookies = await has('name')

    const pathWithSearch = req.nextUrl.href.replace(req.nextUrl.origin, '')
    console.log(pathWithSearch, '--->pathWithSearch');
    
    // 未登录，跳转到登录页面
    if (!cookies && !pathWithSearch.startsWith('/signIn')) {
        return NextResponse.redirect(new URL('/signIn', req.nextUrl))
    }

    // 已登录，跳转到 about 页面
    if (cookies && pathWithSearch.startsWith('/signIn')) {
        return NextResponse.redirect(new URL(`/notice`, req.nextUrl))
    }

    // const token = await getToken({ req });
    // const isAuthenticated = !!token;
    // if (!req.nextUrl.pathname.startsWith('/auth/signin') && !isAuthenticated) {
    //     return NextResponse.redirect(new URL('/auth/signin', req.url));
    // }

    // if (req.nextUrl.pathname.startsWith('/auth/signin') && isAuthenticated) {
    //     return NextResponse.redirect(new URL('/notice', req.url));
    // }

    // const authMiddleware = await withAuth({
    //     pages: {
    //         signIn: `/auth/signin`,
    //     },
    // });

   
    return NextResponse.next()

}

// // Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|favicon|images|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)'],
}

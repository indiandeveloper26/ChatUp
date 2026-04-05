import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {

    if (2 == 22) {
        console.log('u can go now')
    }
    return NextResponse.redirect(new URL('/post', request.url))
}

export const config = {
    matcher: '/about/:path*',
}
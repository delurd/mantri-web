import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { credentialKey, host } from './utils/variables'
import { cekLogin, removeCookies } from './app/action'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')
    const urlPath = request.nextUrl.pathname;

    if (urlPath == '/pak-mantri') {
        // const cookieStore = cookies()

        const res = await fetch(host + '/api/auth/login',
            {
                headers: {
                    Authorization: token?.value ?? '',
                    credentialKey: credentialKey
                }
            })

        if (!token?.value || res.status !== 200) {
            // removeCookies('token');
            // const response = NextResponse.next({
            //     headers: {
            //         cookie: request.headers.get('cookie') ?? ''
            //     }
            // });

            // response.cookies.delete('token');

            return NextResponse.redirect(new URL('/pak-mantri/login', request.url))
        }
    }

    if (urlPath == '/pak-mantri/login') {
        const isVerified = await cekLogin(token?.value ?? '')

        if (isVerified) return NextResponse.redirect(new URL('/pak-mantri', request.url))
    }




    if (urlPath.includes('/api')) {
        const cred = request.headers.get("credentialKey")

        if (!cred || cred !== credentialKey) return NextResponse.rewrite(new URL('/404', request.url))

    }
}

// See "Matching Paths" below to learn more
// export const config = {
//     matcher: '/pak-mantri',
// }
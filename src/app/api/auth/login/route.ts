import { generateRandomLatter } from "@/utils/randomLetter";
import { credentialKey } from "@/utils/variables";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
    const cred = request.headers.get("credentialKey")
    const auth = request.headers.get("Authorization")

    const getToken = await kv.get('loginToken')

    if (!cred || cred !== credentialKey || !auth || auth !== getToken) return NextResponse.json({}, { status: 401 })

    return NextResponse.json({ message: 'success' }, { status: 200 })
}


export const POST = async (request: NextRequest) => {
    const cred = request.headers.get("credentialKey")

    if (!cred || cred !== credentialKey) return NextResponse.json({}, { status: 401 })

    const body = await request.json()
    const requiredResponse = []

    const username = body.username
    const password = body.password

    !username && requiredResponse.push({ role: username, message: 'username required' })
    !password && requiredResponse.push({ role: password, message: 'password required' })

    if (!username || !password) return NextResponse.json({ message: 'failed', error: requiredResponse }, { status: 400 })
    console.log('login terisi');

    if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) return NextResponse.json({ message: 'failed', errormessage: [{ message: 'Login failed, wrong username or password' }] }, { status: 400 })

    console.log('login berhasuiil');

    const token = generateRandomLatter(10) + (+new Date).toString() + generateRandomLatter(12)
    await kv.set('loginToken', token)

    return NextResponse.json({ message: 'success', data: { token: token, message: 'login success' } }, { status: 200 })
}



export const DELETE = async (request: NextRequest) => {
    const cred = request.headers.get("credentialKey")

    if (!cred || cred !== credentialKey) return NextResponse.json({}, { status: 401 })

    await kv.set('loginToken', '')

    return NextResponse.json({ message: 'success', data: { message: 'logout success' } }, { status: 200 })
}
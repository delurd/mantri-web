import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
    try {
        const getManualStatus = await kv.get('manualStatusPractice');

        if (getManualStatus == null) return NextResponse.json({ message: 'failed', error: 'no data found' }, { status: 404 })

        return NextResponse.json({ message: 'sukses', data: { status: getManualStatus } })
    } catch (error) {
        // Handle errors
        return NextResponse.json({ message: 'failed', error: error })
    }
}


export const POST = async (request: NextRequest) => {
    const body = await request.json()
    const status = body.status


    if (status == null) {
        return NextResponse.json({ message: 'failed', error: [{ role: 'status', message: 'status required' }] }, { status: 400 })
    }

    if (status !== 'open' && status !== 'close') {
        console.log('gak sesuai');
        return NextResponse.json({ message: 'failed', error: [{ role: 'status', message: 'status only accept open or close' }] }, { status: 400 })

    }
    console.log('sesuai');

    try {
        const getManualStatus = await kv.set('manualStatusPractice', status);

        if (getManualStatus == null) return NextResponse.json({ message: 'failed', error: 'no data found' }, { status: 404 })

        return NextResponse.json({ message: 'sukses', data: {status : status} })
    } catch (error) {
        // Handle errors
        return NextResponse.json({ message: 'failed', error: error })
    }
}
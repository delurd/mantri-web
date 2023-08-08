import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try {
        const getManualStatus = await kv.get('manualStatus');
        // console.log(getManualStatus);
        if (!getManualStatus) return NextResponse.json({ message: 'failed', error: 'no data found' }, { status: 404 })

        return NextResponse.json({ message: 'sukses', data: getManualStatus })
    } catch (error) {
        // Handle errors
        return NextResponse.json({ message: 'failed', error: error })
    }
}


export const POST = async (request: NextRequest) => {
    const body = await request.json()
    let requiredBody = []

    const status = body.status
    console.log(body);

    if (!status) {
        return NextResponse.json({ message: 'failed', error: 'status required' }, { status: 400 })
    }

    try {
        await kv.set('manualStatus', status);

        const getManualStatus = await kv.get('manualStatus');
        // console.log(await kv.get('manualStatus'));

        return NextResponse.json({ message: 'sukses', data: getManualStatus })
    } catch (error) {
        // Handle errors
        console.log(error);

        return NextResponse.json({ message: 'failed', error: error })
    }
}
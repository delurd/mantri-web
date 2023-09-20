import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { iotCredentialKey } from "@/utils/variables";


export const GET = async (request: NextRequest) => {
    const heders = request.headers

    try {
        const statusDoor = await kv.get('doorStatus')

        return NextResponse.json({ message: 'success', data: statusDoor }, { status: 200 })
    } catch (error) {

    }

    return NextResponse.json({ message: 'failed' }, { status: 400 })

}


export const POST = async (request: NextRequest) => {
    const heders = request.headers
    // console.log(heders.get("date"));
    // console.log(heders.get('content-length'));

    const json = await request.json()
    const iotKey = json?.IOTKey;
    const doorStatus = json?.doorStatus;
    // console.log('door ' + doorStatus);

    if (iotKey !== iotCredentialKey && doorStatus !== undefined) return NextResponse.json({ message: 'failed' }, { status: 403 })

    let isDoorOpen = doorStatus == 'open' ? true : false;
    await kv.set('doorStatus', isDoorOpen)

    return NextResponse.json({ message: 'success' }, { status: 200 })
}
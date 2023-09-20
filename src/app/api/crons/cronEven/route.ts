import { NextRequest, NextResponse } from 'next/server';
import { setKvDoorSensorOnline } from '../../action';

export async function GET(request: NextRequest) {
    const head = request.headers

    try {
        console.log('ini response door sensor');
        const res = await fetch('http://192.168.134.88/status');
        const json = await res.json()
        console.log(json.status);
        console.log('ini response door sensor end');

        await setKvDoorSensorOnline(true)

        return NextResponse.json({ ok: true });
    } catch (error) {
        await setKvDoorSensorOnline(false)
    }


    return NextResponse.json({ ok: false });
}
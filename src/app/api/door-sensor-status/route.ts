import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { iotCredentialKey } from "@/utils/variables";
import moment from "moment";
import { doorSensorLastUpdate, getDoorSensorLastUpdate, setDoorSensorLastUpdate } from "@/utils/data/doorSendor";


let doorSensorUpdate = 'date'

export const GET = async (request: NextRequest) => {
    const heders = request.headers

    console.log('last update ' + doorSensorUpdate);

    try {
        const statusDoor = await kv.get('doorStatus')

        return NextResponse.json({ message: 'success', data: statusDoor, lastUpdate: doorSensorUpdate }, { status: 200 })
    } catch (error) {

    }

    return NextResponse.json({ message: 'failed' }, { status: 400 })

}


export const POST = async (request: NextRequest) => {
    const heders = request.headers
    console.log(heders.get("date"));
    const getDate = heders.get("date")

    // setDoorSensorLastUpdate(getDate ?? '');
    doorSensorUpdate = getDate ?? ''
    console.log(moment(getDate).format('X'));


    // console.log(heders.get('content-length'));

    const json = await request.json()
    const iotKey = json?.IOTKey;
    const doorStatus = json?.doorStatus;
    console.log('door ' + doorStatus);

    if (iotKey !== iotCredentialKey && doorStatus !== undefined) return NextResponse.json({ message: 'failed' }, { status: 403 })

    let isDoorOpen = doorStatus == 'open' ? true : false;
    await kv.set('doorStatus', isDoorOpen)

    return NextResponse.json({ message: 'success' }, { status: 200 })
}
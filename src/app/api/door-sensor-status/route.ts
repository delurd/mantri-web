import { NextRequest, NextResponse } from "next/server";
import { iotCredentialKey } from "@/utils/variables";
import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient()

export const GET = async (request: NextRequest) => {
    const heders = request.headers

    try {
        // const statusDoor = await kv.get('doorStatus')
        const statusDoor = await prisma.doorStatus.findUnique({ where: { id: 1 } })

        return NextResponse.json({ message: 'success', data: statusDoor?.status, time: statusDoor?.time }, { status: 200 })
    } catch (error) {

    }

    return NextResponse.json({ message: 'failed' }, { status: 400 })

}


export const POST = async (request: NextRequest) => {
    const heders = request.headers
    // const getDate = heders.get("date")

    const json = await request.json()
    const iotKey = json?.IOTKey;
    const doorStatus = json?.doorStatus;
    const time = json?.time;


    if (iotKey !== iotCredentialKey || doorStatus == undefined || time == undefined) return NextResponse.json({ message: 'failed' }, { status: 403 })

    let isDoorOpen = doorStatus !== 'open' ? true : false;
    // await kv.set('doorStatus', isDoorOpen)

    if (await prisma.doorStatus.findUnique({ where: { id: 1 } })) {
        await prisma.doorStatus.update({ where: { id: 1 }, data: { status: isDoorOpen, time: moment((new Date())).utcOffset(7).format() } })
    } else {
        await prisma.doorStatus.create({ data: { status: isDoorOpen, time: moment((new Date())).utcOffset(7).format() } })
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
}
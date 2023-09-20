import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest) => {
    try {
        const res = await kv.get("doorSensorUsage");

        return NextResponse.json({ message: "success", data: res })
    } catch (error) {
    }

    return NextResponse.json({ message: "failed" }, { status: 400 })
}


export const POST = async (request: NextRequest) => {
    const body = await request.json()

    const status = body.status;

    if (typeof status == "boolean") {
        try {
            const res = await kv.set("doorSensorUsage", status);

            return NextResponse.json({ message: "success", data: status })
        } catch (error) {
        }
    }

    return NextResponse.json({ message: "failed" }, { status: 400 })
}
import moment from "moment";
import { NextResponse } from "next/server"
import { jadwalSholatLamongan } from "@/utils/data/jadwalSholat";

export const GET = async (request: Request, response: Response) => {
    return NextResponse.json({ message: 'success', data: "Hello" })
}
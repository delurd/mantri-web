import { jamPraktikBuka, jamPraktikType } from "@/utils/data/jamPraktik"
import { generateRandomLatter } from "@/utils/randomLetter"
import { kv } from "@vercel/kv"
import { NextRequest, NextResponse } from "next/server"


export const GET = async () => {
    const jamPraktik = await kv.get('jamPraktikBuka')
    // console.log(generateRandomLatter(10)+(+new Date).toString());
    

    return NextResponse.json({ message: 'sukses', data: jamPraktik ?? jamPraktikBuka })
}

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    const requiredBody = []

    //CHECK
    const id = +new Date()
    const startAt = body.startAt
    const endAt = body.endAt
    console.log(body);

    !startAt && requiredBody.push({ role: 'startAt', message: 'startAt required' })
    !endAt && requiredBody.push({ role: 'endAt', message: 'endAt required' })

    if (requiredBody.length) {
        return NextResponse.json({ message: 'failed', error: requiredBody }, { status: 400 })
    }

    //MAIN
    jamPraktikBuka.push({ id: id.toString(), start: startAt, end: endAt })

    const jamPraktikDB: any = await kv.get('jamPraktikBuka') ?? []
    jamPraktikDB.push({ id: id.toString(), start: startAt, end: endAt })
    await kv.set('jamPraktikBuka', jamPraktikDB)

    return NextResponse.json({ message: 'sukses', data: jamPraktikDB })
}

export const DELETE = async (request: NextRequest) => {
    const body = await request.json()
    const requiredBody = []

    //CHECK
    const id = body.id

    !id && requiredBody.push({ role: 'id', message: 'id required' })
    if (requiredBody.length) {
        return NextResponse.json({ message: 'failed', error: requiredBody }, { status: 400 })
    }

    //MAIN
    const jamPraktikDB: any = await kv.get('jamPraktikBuka') ?? []
    //local
    const getIndex = jamPraktikBuka.findIndex((data) => { return data.id == id })
    getIndex && jamPraktikBuka.splice(getIndex, 1)

    if (jamPraktikDB.length) {
        const _getIndex = jamPraktikDB.findIndex((data: any) => { return data?.id == id })
        _getIndex && jamPraktikDB.splice(_getIndex, 1)
        await kv.set('jamPraktikBuka', jamPraktikDB)
    }

    return NextResponse.json({ message: 'sukses', data: jamPraktikDB })
}

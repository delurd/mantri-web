import { jamPraktikBuka } from "@/utils/data/jamPraktik"
import { NextRequest, NextResponse } from "next/server"


export const GET = async () => {

    return NextResponse.json({ message: 'sukses', data: jamPraktikBuka })
}



export const POST = async (request: NextRequest) => {
    const body = await request.json()
    let requiredBody = []

    const id = +new Date()
    const startAt = body.startAt
    const endAt = body.endAt
    console.log(body);

    !startAt && requiredBody.push({ role: 'startAt', message: 'startAt required' })
    !endAt && requiredBody.push({ role: 'endAt', message: 'endAt required' })

    if (requiredBody.length) {
        return NextResponse.json({ message: 'failed', error: requiredBody }, { status: 400 })
    }


    jamPraktikBuka.push({ id: id.toString(), start: startAt, end: endAt })

    return NextResponse.json({ message: 'sukses', data: jamPraktikBuka })
}

export const DELETE = async (request: NextRequest) => {
    const body = await request.json()
    const requiredBody = []

    const id = body.id

    !id && requiredBody.push({ role: 'id', message: 'id required' })
    if (requiredBody.length) {
        return NextResponse.json({ message: 'failed', error: requiredBody }, { status: 400 })
    }

    const getIndex = jamPraktikBuka.findIndex((data) => { return data.id == id })

    jamPraktikBuka.splice(getIndex, 1)

    return NextResponse.json({ message: 'sukses', data: jamPraktikBuka })
}

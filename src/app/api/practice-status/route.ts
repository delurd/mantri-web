import moment from "moment";
import { NextRequest, NextResponse } from "next/server"
import { jadwalSholatLamongan } from "@/utils/data/jadwalSholat";
import 'moment/locale/id';
import { jamPraktikBuka, jamPraktikType } from "@/utils/data/jamPraktik";
import { info } from "@/utils/data/information";
import { credentialKey } from "@/utils/variables";
import { kv } from "@vercel/kv";
import { PrismaClient } from "@prisma/client";
import { cekIsSensorOnline } from "@/app/action";
import { cekIsPrayerTime } from "./action";

moment.locale('id')
const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    if (!body.time) return NextResponse.json({ message: 'failed', error: [{ role: 'time', message: 'datetime required' }] }, { status: 400 })
    let statusPractice: 'close' | 'open' = 'close'
    let informasiDetail = ''

    //CEK IF USING MANUAL
    const isManual = await kv.get('manualStatus')
    if (isManual) {
        const manualStatusPractice = await kv.get('manualStatusPractice')

        informasiDetail = manualStatusPractice == 'open' ? 'Praktik Buka' : 'Praktik Tutup'

        const dataReturn = {
            time: moment(body.time).utcOffset(7).format(),
            status: manualStatusPractice,
            information: informasiDetail
        }
        return NextResponse.json({ message: 'success', data: dataReturn }, { status: 200 })
    }

    //CEK IF SENSOR ONLINE AND DOOR SENSOR CLOSE
    try {
        const statusDoor = await prisma.doorStatus.findUnique({ where: { id: 1 } })

        const isOnline = await cekIsSensorOnline(statusDoor?.time ?? "00:00:00")

        if (isOnline) {
            if (statusDoor?.status) {
                //IS OPEN CEK PRAYER TIME
                const isPrayerTime = cekIsPrayerTime()
                // JIKA TIBA WAKTU SHOLAT MAKA TUTUP
                if (isPrayerTime) {
                    statusPractice = 'close'
                    informasiDetail = info.sholat
                } else {
                    statusPractice = 'open'
                }
            } else {
                statusPractice = 'close'
            }

            const dataReturn = {
                time: moment(new Date()).utcOffset(7).format(),
                status: statusPractice,
                information: informasiDetail
            }

            return NextResponse.json({ message: 'success', data: dataReturn }, { status: 200 })
        } else {
            // console.log("OFLINEEEEE")
            const dataReturn = {
                time: moment(new Date()).utcOffset(7).format(),
                status: statusPractice,
                information: "offline"
            }

            return NextResponse.json({ message: 'success', data: dataReturn }, { status: 200 })
        }
    } catch (error) {

    }


    //BY JADWAL PRAKTEK
    //GET DATA JAM PRAKTIK FROM DB
    const jamPraktik: jamPraktikType[] = await kv.get('jamPraktikBuka') ?? jamPraktikBuka

    const thisMonth: number = parseInt(moment(body.time).utcOffset(7).format("M"));
    const thisDay: number = parseInt(moment(body.time).utcOffset(7).format("D"));
    const thisTime = moment(body.time).utcOffset(7).format('HH:mm')

    const jadwalSholatBulanan = Object.values(jadwalSholatLamongan)[thisMonth - 1]
    const jadwalSholatHarian = Object.values(jadwalSholatBulanan)[thisDay - 1]

    let praAdzan = '';
    let istirahatSholat = ''

    //CHECK JAM BUKA
    for (let x = 0; x < jamPraktik.length; x++) {
        const jamBuka = jamPraktik[x]

        // console.log('jam buka ' + jamBuka.start);

        //JIKA JAM SESUAI JAM BUKA MAKA OPEN
        if (thisTime >= jamBuka.start &&
            thisTime <= jamBuka.end
        ) {
            statusPractice = "open";
            informasiDetail = info.buka

            //CHECK WAKTU ADZAN
            const isPrayerTime = cekIsPrayerTime()
            // JIKA TIBA WAKTU SHOLAT MAKA TUTUP
            if (isPrayerTime) {
                statusPractice = 'close'
                informasiDetail = info.sholat
            } else {
                statusPractice = 'open'
            }

            break;
        } else {
            statusPractice = 'close'
            informasiDetail = info.tutup
        }
    }

    console.log("statusPractice " + statusPractice + moment.locale());

    const dataReturn = {
        time: moment(new Date()).utcOffset(7).format(),
        istirahatSholat: {
            adzanHariIni: jadwalSholatHarian,
            persiapanSholat: praAdzan,
            istirahat: istirahatSholat,
        },
        status: statusPractice,
        information: informasiDetail
    }


    return NextResponse.json({ message: 'success', data: dataReturn }, { status: 200 })
}
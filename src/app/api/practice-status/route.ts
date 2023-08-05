import moment from "moment";
import { NextRequest, NextResponse } from "next/server"
import { jadwalSholatLamongan } from "@/utils/data/jadwalSholat";
import 'moment/locale/id';
import { jamPraktikBuka } from "@/utils/data/jamPraktik";
import { info } from "@/utils/data/information";
import { credentialKey } from "@/utils/variables";

moment.locale('id')

export const GET = async (request: NextRequest, response: Response) => {
    const cred = request.headers.get("credentialKey")
    // console.log(credentialKey);
    if (!cred || cred !== credentialKey) return NextResponse.json({}, { status: 403 })


    let statusPractice: 'close' | 'open' = 'close'
    let informasiDetail = ''

    const thisMonth: number = parseInt(moment().format("M"));
    const thisDay: number = parseInt(moment().format("D"));
    const thisTime = moment().format('HH:mm')

    const jadwalSholatBulanan = Object.values(jadwalSholatLamongan)[thisMonth - 1]
    const jadwalSholatHarian = Object.values(jadwalSholatBulanan)[thisDay - 1]

    const jumlahWaktuSholat = Object.keys(jadwalSholatHarian).length;
    const waktuIstirahat = 20;

    //CHECK JAM BUKA
    for (let x = 0; x < jamPraktikBuka.length; x++) {
        const jamBuka = jamPraktikBuka[x]

        // console.log('jam buka ' + jamBuka.start);

        //JIKA JAM SESUAI JAM BUKA MAKA OPEN
        if (thisTime >= jamBuka.start &&
            thisTime <= jamBuka.end
        ) {
            statusPractice = "open";
            informasiDetail = info.buka

            //CHECK WAKTU ADZAN
            for (let i = 0; i < jumlahWaktuSholat; i++) {
                const waktuAdzan = Object.values(jadwalSholatHarian)[i]
                let waktuAdzanHour = parseInt(waktuAdzan.split(':')[0])
                let waktuAdzanMinute = parseInt(waktuAdzan.split(':')[1])

                //CALCULATE WAKTU ISTIRAHAT SHOLAT
                let waktuIstirahatSholatHour = waktuAdzanHour
                let waktuIstirahatSholatMinutes = waktuAdzanMinute + waktuIstirahat

                if (waktuIstirahatSholatMinutes > 59) {
                    waktuIstirahatSholatMinutes -= 60
                    waktuIstirahatSholatHour += 1
                }
                const waktuIstirahatSholat = moment((waktuIstirahatSholatHour + ':' + waktuIstirahatSholatMinutes), 'h:m').format('HH:mm')

                //CALCULATE PERSIAPAN ADZAN / SHOLAT
                const miliPraAdzan = 10 * 60 //MENIT PER DETIK
                const miliWaktuAdzan = parseInt(moment(waktuAdzan, 'HH:mm').format('X'))
                const praWaktuAdzan = moment((miliWaktuAdzan - miliPraAdzan), 'X').format('HH:mm')

                //JIKA TIBA WAKTU SHOLAT MAKA TUTUP
                if (thisTime >= praWaktuAdzan &&
                    thisTime <= waktuIstirahatSholat
                ) {
                    statusPractice = 'close'
                    informasiDetail = info.sholat
                    break;
                } else {
                    statusPractice = 'open'
                }
            }

            break;
        } else {
            statusPractice = 'close'
            informasiDetail = info.tutup
        }
    }

    console.log("statusPractice " + statusPractice + moment.locale());

    return NextResponse.json({ message: 'success', data: { status: statusPractice, information: informasiDetail, time: moment().format() } })
}



export const POST = async (request: NextRequest) => {
    const body = await request.json()
    console.log('post');

    console.log(body);

    const dataReturn = {
        date : moment(body.time).format("DD-MM-YYYY"),
        clock: moment(body.time).format("HH:mm"),
    }


    return NextResponse.json({ message: 'success' , data: dataReturn}, { status: 200 })
}
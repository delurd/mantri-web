import moment from "moment";
import { NextRequest, NextResponse } from "next/server"
import { jadwalSholatLamongan } from "@/utils/data/jadwalSholat";
import 'moment/locale/id';
import { jamPraktikBuka, jamPraktikType } from "@/utils/data/jamPraktik";
import { info } from "@/utils/data/information";
import { credentialKey } from "@/utils/variables";
import { kv } from "@vercel/kv";

moment.locale('id')

export const GET = async (request: NextRequest, response: Response) => {
    const cred = request.headers.get("credentialKey")
    // console.log(credentialKey);
    if (!cred || cred !== credentialKey) return NextResponse.json({}, { status: 401 })


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
    // console.log('post');
    // console.log(body);

    if (!body.time) return NextResponse.json({ message: 'failed', error: [{ role: 'time', message: 'datetime required' }] }, { status: 400 })
    let statusPractice: 'close' | 'open' = 'close'
    let informasiDetail = ''

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


    //GET DATA JAM PRAKTIK FROM DB
    const jamPraktik: jamPraktikType[] = await kv.get('jamPraktikBuka') ?? jamPraktikBuka

    const thisMonth: number = parseInt(moment(body.time).utcOffset(7).format("M"));
    const thisDay: number = parseInt(moment(body.time).utcOffset(7).format("D"));
    const thisTime = moment(body.time).utcOffset(7).format('HH:mm')

    const jadwalSholatBulanan = Object.values(jadwalSholatLamongan)[thisMonth - 1]
    const jadwalSholatHarian = Object.values(jadwalSholatBulanan)[thisDay - 1]

    const jumlahWaktuSholat = Object.keys(jadwalSholatHarian).length;
    const waktuIstirahat = 20;
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
                praAdzan = praWaktuAdzan;
                istirahatSholat = waktuIstirahatSholat

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

    const dataReturn = {
        time: moment(body.time).utcOffset(7).format(),
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
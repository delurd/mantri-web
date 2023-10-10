import { jadwalSholatLamongan } from "@/utils/data/jadwalSholat";
import moment from "moment";

export const cekIsPrayerTime = () => {
    const thisMonth: number = parseInt(moment(new Date()).utcOffset(7).format("M"));
    const thisDay: number = parseInt(moment(new Date()).utcOffset(7).format("D"));
    const thisTime = moment(new Date()).utcOffset(7).format('HH:mm')

    const jadwalSholatBulanan = Object.values(jadwalSholatLamongan)[thisMonth - 1]
    const jadwalSholatHarian = Object.values(jadwalSholatBulanan)[thisDay - 1]

    const jumlahWaktuSholat = Object.keys(jadwalSholatHarian).length;
    const waktuIstirahat = 20; //minute
    const miliPraAdzan = 10 * 60 //MENIT PER DETIK
    let praAdzan = '';
    let istirahatSholat = ''

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
        const miliWaktuAdzan = parseInt(moment(waktuAdzan, 'HH:mm').format('X'))
        const praWaktuAdzan = moment((miliWaktuAdzan - miliPraAdzan), 'X').format('HH:mm')
        praAdzan = praWaktuAdzan;
        istirahatSholat = waktuIstirahatSholat
        //JIKA TIBA WAKTU SHOLAT MAKA TUTUP
        if (thisTime >= praWaktuAdzan &&
            thisTime <= waktuIstirahatSholat
        ) {
            return true
        }
    }

    return false
}
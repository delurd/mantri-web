import { kv } from "@vercel/kv"
import { WebSocket } from "ws"

type statusType = "open" | "close"


const getKvDoorStatus = async () => {
    return await kv.get("doorStatus")
}

const setKvDoorStatus = async (value: string) => {
    return await kv.set("doorStatus", value)
}

const getKvDoorSensorUsage = async () => {
    return await kv.get("doorSensorUsage");
}

const gsetKvDoorSensorUsage = async (value: boolean) => {
    return await kv.set("doorSensorUsage", value);
}

const getKvDoorSensorOnline = async () => {
    return await kv.get("doorSensorOnline")
}

const setKvDoorSensorOnline = async (value: boolean) => {
    return await kv.set("doorSensorOnline", value)
}



const getKvManualStatus = async () => {
    return await kv.get('manualStatus');
}

const setKvManualStatus = async (value: boolean) => {
    return await kv.set('manualStatus', value);
}

const getKvManualStatusPractice = async () => {
    return await kv.get('manualStatusPractice');
}

const setKvManualStatusPractice = async (value: string) => {
    return await kv.set('manualStatusPractice', value);
}


const getKvDataJadwal = async () => {
    return await kv.get('jamPraktikBuka');
}

const setKvDataJadwal = async (value: any[]) => {
    return await kv.set('jamPraktikBuka', value);
}



const cekSocketConnection = async () => {
    try {
        const socket = new WebSocket('ws://192.168.134.88:81')

        socket.onopen = event => {

        }


    } catch (error) {

    }
}



export { getKvDoorStatus, setKvDoorSensorOnline, getKvDoorSensorOnline }
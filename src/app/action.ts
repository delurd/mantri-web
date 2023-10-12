'use server'

import { credentialKey, host } from '@/utils/variables';
import moment from 'moment';
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server';
import { SyntheticEvent } from 'react';

export async function createCookies(name: string, value: string) {
    const fullMonth = 60 * 60 * 1000
    cookies().set(name, value, { maxAge: fullMonth })
}

export async function removeCookies(name: string) {
    try {
        cookies().delete(name)
    } catch (error) {
        console.log(error);
    }
}

export async function cekCookies(name: string) {
    const cokie = cookies().get(name)

    if (!cokie) return false

    return true
}


export async function cekLogin(auth: any) {
    const res = await fetch(host + '/api/auth/login',
        {
            headers: {
                Authorization: auth ?? '',
                credentialKey: credentialKey
            }
        })

    if (res.status !== 200) return false

    return true
}

export async function handleLogout() {
    const res = await fetch(host + '/api/auth/login', {
        method: 'DELETE',
        cache: 'no-store',
        headers: { credentialKey: credentialKey },
    });
    if (res.status == 200) {
        removeCookies('token')

        return true
    }

    return false
}

export const actionLogin = async (username: string, password: string) => {

    if (!username || !password) return;

    const res = await fetch(host + '/api/auth/login', {
        method: 'POST',
        cache: 'no-store',
        headers: { credentialKey: credentialKey },
        body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (json.message !== 'success') {
        return;
    }

    const data = json.data;

    return json
};


export const cekIsSensorOnline = (time: string) => {
    const batas = 800 //14mnt
    const calculateGap =
        parseInt(moment(time, 'HH:mm:ss').format('X')) - parseInt(moment(new Date()).utcOffset(7).format('X'));
    console.log(calculateGap + "<<<<<<<<<<<<<<<<<<<<<<");

    if ((calculateGap * -1) < batas) { return { data: true, gapTime: calculateGap, timeDb: moment(new Date()).utcOffset(7).format('X'), timeDbs: moment(new Date()).utcOffset(7).format('HH:mm:ss'), timeSensor: moment(time, 'HH:mm:ss').format('X') } }

    return { data: false, gapTime: calculateGap, timeDb: parseInt(moment(new Date()).utcOffset(7).format('X')), timeDbs: moment(new Date()).utcOffset(7).format('HH:mm:ss'), timeSensor: parseInt(moment(time, 'HH:mm:ss').format('X')) }
}
import { env } from '$env/dynamic/private';
import type { GameObject } from '$lib/types.js';

export const load = async ({ params }) => {
    const resp = await fetch("https://api.gameupc.com/test/upc/" + params.code, {
        headers: {
            "X-Api-Key": env.API_KEY || ""
        }
    })
    const data = await resp.json()
    
    return data as GameObject
};
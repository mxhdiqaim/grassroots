import { getEnvVariable } from "../utils";

const ACCOUNT_ID = getEnvVariable("CLOUDFLARE_ACCOUNT_ID");
const API_TOKEN = getEnvVariable("CLOUDFLARE_API_TOKEN");

export const createLiveInput = async (matchTitle: string) => {
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream/live_inputs`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            meta: { name: matchTitle },
            recording: {
                mode: 'automatic',
                requireSignedURLs: false // Set to true later for premium access
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Cloudflare Error: ${JSON.stringify(error)}`);
    }

    // Explicitly define the type you expect from the response
    const { result } = (await response.json()) as {
        result: {
            uid: string;
            rtmps: { url: string; streamKey: string };
            playback: { hls: string };
        }
    };

    return {
        uid: result.uid,
        // The RTMPS URL for the streamer's phone
        rtmpsUrl: result.rtmps.url,
        streamKey: result.rtmps.streamKey,
        // The HLS (.m3u8) URL for the fans' phones
        playbackUrl: result.playback.hls
    };
};
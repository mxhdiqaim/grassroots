import { getEnvVariable } from "../utils";

const ACCOUNT_ID = getEnvVariable("CLOUDFLARE_ACCOUNT_ID");
const API_TOKEN = getEnvVariable("CLOUDFLARE_API_TOKEN");
const NODE_ENV = getEnvVariable("NODE_ENV");

export const createLiveInput = async (matchTitle: string) => {
    // If we are in dev and don't have keys, return MOCK data
    if (NODE_ENV === "development" && (!ACCOUNT_ID || !API_TOKEN)) {
        console.log(`🛠️ [MOCK] Creating Live Input for: ${matchTitle}`);

        return {
            uid: `mock-uid-${Math.random().toString(36).substr(2, 9)}`,
            rtmpsUrl: "rtmps://live.cloudflare.com:443/live/",
            streamKey: "MOCK_KEY_12345_TESTING",
            playbackUrl: "https://customer-example.cloudflarestream.com/mock/manifest/video.m3u8"
        };
    }

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
                requireSignedURLs: false
            }
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Cloudflare Error: ${JSON.stringify(error)}`);
    }

    // Explicitly define the type you expect from the response
    const { result } = (await response.json()) as any;

    return {
        uid: result.uid,
        rtmpsUrl: result.rtmps.url,
        streamKey: result.rtmps.streamKey,
        playbackUrl: result.playback.hls,
    };
};
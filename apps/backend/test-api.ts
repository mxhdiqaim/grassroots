const BASE_URL = "http://localhost:3000/api/v1";
const MATCH_ID = "PASTE_YOUR_ID_HERE";

async function testGoLive() {
    console.log(`🚀 Testing Go-Live for Match: ${MATCH_ID}...`);

    const response = await fetch(`${BASE_URL}/matches/${MATCH_ID}/go-live`, {
        method: 'POST'
    });

    const data = await response.json();

    if (response.ok) {
        console.log("✅ SUCCESS!");
        console.log("-------------------");
        console.log("RTMP URL: ", (data as any).stream_url);
        console.log("Stream Key: ", (data as any).stream_key);
        console.log("HLS Playback: ", (data as any).viewer_url);
        console.log("-------------------");
        console.log("Check your Cloudflare Stream dashboard; you should see a new 'Live Input'!");
    } else {
        console.error("❌ FAILED:", data);
    }
}

testGoLive();
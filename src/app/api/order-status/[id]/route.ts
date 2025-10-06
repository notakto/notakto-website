import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const COINBASE_API_KEY = process.env.COINBASE_API_KEY;
	if (!COINBASE_API_KEY) {
		return NextResponse.json({ status: "missing_api_key" }, { status: 500 });
	}
	const COINBASE_API_URL = "https://api.commerce.coinbase.com/charges";

	try {
		const chargeId = req.nextUrl.pathname.split("/").pop(); // gets the [id] from URL

		if (!chargeId) {
			return NextResponse.json({ status: "missing_id" }, { status: 400 });
		}

		const response = await axios.get(`${COINBASE_API_URL}/${chargeId}`, {
			headers: {
				"X-CC-Api-Key": COINBASE_API_KEY,
				"X-CC-Version": "2018-03-22",
			},
		});

		const timeline = response.data.data.timeline;
		const latestStatus = timeline[timeline.length - 1]?.status.toLowerCase();

		return NextResponse.json({ status: latestStatus });
	} catch (error) {
		console.error("Error checking payment status:", error);
		return NextResponse.json({ status: "unknown" }, { status: 500 });
	}
}

// app/api/payment/order/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
	const body = await req.json(); 
	const token = req.headers.get("Authorization") || "";
	console.log(body)
	try {
		
		
		
		const response = await axios.post(
			`${process.env.SPRING_API}/api/order/create`,
			body,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
				withCredentials: true,
			}
		);

		return NextResponse.json(response.data, { status: response.status });
	} catch (error: any) {
		console.error("Order proxy error:", error?.response?.data || error.message);
		const status = error.response?.status || 500;
		return NextResponse.json(
			{ message: "Order creation failed", error: error.response?.data },
			{ status }
		);
	}
}

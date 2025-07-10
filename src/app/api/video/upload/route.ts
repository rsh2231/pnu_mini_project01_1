import FormData from "form-data";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const orderId = formData.get("orderId") as string;
    const file = formData.get("file") as unknown as File;

    if (!(file instanceof Blob)) {
        return NextResponse.json({ message: "Invalid file" }, { status: 400 });
    }

    const springurl = process.env.SPRING_API;
    const buffer = Buffer.from(await file.arrayBuffer());

    const axiosForm = new FormData();
    axiosForm.append("orderId", orderId);
    axiosForm.append("file", buffer, {
        filename: file.name || "video.mp4",
        contentType: file.type || "video/mp4",
    });

    try {
        const res = await axios.post(`${springurl}/video/upload`, axiosForm, {
            headers: {
                ...axiosForm.getHeaders(), // boundary 포함된 Content-Type 자동 생성
            },
        });

        console.log("동영상 업로드", res);
        return NextResponse.json({ message: "Upload successful", result: res.data });
    } catch (err: any) {
        console.error("Upload Error:", err.response?.data || err.message);
        return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
    }
}
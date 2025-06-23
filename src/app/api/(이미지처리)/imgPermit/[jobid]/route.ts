import axios from "axios";
import { header } from "framer-motion/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const body = await req.json();
    console.log('api/imgpermit/[jobid]',body)
    const url = new URL(req.url)
    const jobid = url.pathname.split('/').filter(Boolean).pop()
    const springurl = process.env.SPRING_API
    try {
        const res = await axios.post(`${springurl}/api/inference/${jobid}/permission/final`,body,{headers:{"Content-Type":'application/json'}})
        console.log(res.data)
        return NextResponse.json(res.data,{status:200})
    } catch (error:any) {
        console.error('api/imgpermit/[jobid] 파이썬 요청 실패', error.message, "서버 응답 데이터 : " ,error.response.data);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
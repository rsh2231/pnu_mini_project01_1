import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. 요청 본문 파싱
    const body = await req.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { message: "paymentId is required" },
        { status: 400 }
      );
    }

    // 2. 결제 처리 로직 (예시)
    // - 포트원 API 연동
    // - DB 업데이트 등
    console.log("Processing payment:", paymentId);

    // 3. 성공 응답
    return NextResponse.json(
      { status: "PAID", paymentId },
      { status: 200 }
    );

  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
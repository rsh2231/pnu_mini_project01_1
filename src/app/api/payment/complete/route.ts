import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
<<<<<<< HEAD
  try {
    // 1. 요청 본문 파싱
    const body = await req.json();
    const { paymentId ,orderId} = body;

    if (!paymentId) {
      return NextResponse.json(
        { message: "paymentId is required" },
        { status: 400 }
      );
    }
    
    //portone api 조회
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${paymentId}`,
      { headers: { Authorization: `PortOne URKDNi4tryRgOvSu97siqL0HZpzOq3SKu2d0nGkAc9Pu6Uz6lDHQuSquvQtapGaqAQNWhpa00zltPSx2` } },
    );
    console.log(paymentResponse)
    if (!paymentResponse.ok)
      throw new Error(`paymentResponse: ${await paymentResponse.json()}`);
    
    const payment = await paymentResponse.json();


    //db랑 비교
     //주문시 금액과 결제 진행중 금액이 다를때
    const orderResp = await axios.get(process.env.NEXT_PUBLIC_SPRING_API + "/api/order/valid?" + "orderId=" + orderId)
    .then((orderResp) => {
              console.log(orderResp.data)
              console.log("orderPrice 수")
              console.log(orderResp.data.content.orderPrice)
              console.log(payment.amount.total)
              if(orderResp.data.content.orderPrice !== payment.amount.total && orderResp != null && payment != null){
                return NextResponse.json(
                { message: "Unmacth amount" },
                { status: 500 }
              )
            }
          }
        )
    

    // 2. 결제 처리 로직 (예시)
    // - 포트원 API 연동
    // - DB 업데이트 등
    console.log("Processing payment:", payment);

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
=======
	try {
		// 1. 요청 본문 파싱
		const body = await req.json();
		const { paymentId, orderId } = body;
		console.log("결제 정보", body)
		if (!paymentId) {
			return NextResponse.json(
				{ message: "paymentId is required" },
				{ status: 400 }
			);
		}

		//portone api 조회
		const paymentResponse = await fetch(
			`https://api.portone.io/payments/${paymentId}`,
			// { headers: { Authorization: `PortOne URKDNi4tryRgOvSu97siqL0HZpzOq3SKu2d0nGkAc9Pu6Uz6lDHQuSquvQtapGaqAQNWhpa00zltPSx2` } },
			{ headers: { Authorization: `PortOne apTgCI3T0g6zDOGTpzPANzu2Xyv8a6bHNefHCtdFS5g2ZECHWJOrRWtHXiVBXCxwuT8kNt5iW7bBF0NB` } },
		);
		console.log(paymentResponse)
		if (!paymentResponse.ok)
			throw new Error(`paymentResponse: ${await paymentResponse.json()}`);

		const payment = await paymentResponse.json();


		//db랑 비교
		//주문시 금액과 결제 진행중 금액이 다를때
		const orderResp = await axios.get(process.env.SPRING_API + "/api/order/valid?" + "orderId=" + orderId)
			.then((orderResp) => {
				console.log(orderResp.data)
				console.log("orderPrice 수")
				console.log(orderResp.data.content.orderPrice)
				console.log(payment.amount.total)
				if (orderResp.data.content.orderPrice !== payment.amount.total && orderResp != null && payment != null) {
					return NextResponse.json(
						{ message: "Unmacth amount" },
						{ status: 500 }
					)
				}
			}
			)


		// 2. 결제 처리 로직 (예시)
		// - 포트원 API 연동
		// - DB 업데이트 등
		console.log("Processing payment:", payment);

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
>>>>>>> master
}

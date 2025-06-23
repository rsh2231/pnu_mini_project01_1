'use client'; // 클라이언트 컴포넌트 선언
import { User } from "@/type/user";
import PortOne from "@portone/browser-sdk/v2";
import { Content } from "next/font/google";
import { useEffect, useState, FormEvent } from "react";
import Button01 from "../etc/Button01";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

type OrderPageProps = {
	selectedItems: any,
	confirm:ImagePermitRequestDTO,
	user:User,
}

// 타입 정의
interface Item {
	id: string;
	name: string;
	price: number;
	currency: string;
}

interface PaymentStatus {
	status: 'IDLE' | 'PENDING' | 'FAILED' | 'PAID';
	message?: string;
}

export default function OrderPage({selectedItems, user, confirm}:OrderPageProps)  {
	const host = window.location.hostname;
	console.log("현재 접속한 호스트:", host);
	const [item, setItem] = useState<Item | null>({
	id: "",
	name: "로딩 중...",
	price: 0,
	currency: "KRW"
	});
	const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: "IDLE",
	});
	const NEXT_IP = process.env.NEXT_PUBLIC_NEXT_IP
	const [totalPrice,setTotalPrice] = useState()
	const [isLoading2 , setIsLoading] = useState(false)
	const products:any = []
	let recode:Record<string,number> = {}

	let itemName = selectedItems[0]?.품명 || ''
	if(selectedItems.length > 1){
		itemName += "외 (" +  (String)(selectedItems.length - 1)  +")"
	}

	useEffect(() => {

		selectedItems.map(selItem => products.push(
			{
				id: selItem['id'],
				name: selItem['품명'],
				code: selItem['규격'],
				amount: selItem['수수료'],
				quantity: 1,
				tag: selItem['연번'],
				link: "https://shop.com/products/A1002"
			}
		))

		if(selectedItems != null && selectedItems != ""){
		async function loadItem() {
			const data = 
				{ 
					"id": String(uuidv4()),
					"name": itemName,
					"price": selectedItems
							.flat()
							.reduce(
								(total: number, item: any) =>
								total + (parseInt(item.수수료) || 0),0),
					"currency": "KRW"
				};
				setItem(data)
			}
			setIsLoading(true)
			loadItem().catch((error) => console.error(error))
		}
		
	}, [selectedItems])

	function randomId() {
	return [...crypto.getRandomValues(new Uint32Array(2))]
		.map((word) => word.toString(16).padStart(8, "0"))
		.join("");
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPaymentStatus({ status: "PENDING" });
		const redirectUrl = host.includes("kdtminiproject.myvnc.com")
			? "http://kdtminiproject.myvnc.com:3000"
			: "http://localhost:3000";

		console.log(redirectUrl)
		try {
			const paymentId = randomId();
			const payment = await PortOne.requestPayment({
			//상점아이디
			storeId: process.env.NEXT_PUBLIC_STORE_ID!, 
			//채널키
			channelKey: process.env.NEXT_PUBLIC_CHANNEL_KEY, 
			//고객사 주문 고유번호
			//우리가 만드는 주문코드
			paymentId : item?.id,
			//주문명
			orderName: itemName,
			//결제 금액
			totalAmount: item?.price,
			//결제 통화
			currency: item?.currency,
			productType : "PRODUCT_TYPE_REAL",
			//결제 수단
			payMethod: "CARD",
			//구매자 정보
			customer : {
			//고객 아이디 자유롭게 입력
			customerId : user.username,
			// fullName : "HongGilDong",
			// firstName : "Hong",
			// lastName : "GilDong",
			// phoneNumber : "010-1234-4567"
			},
			//임의의 데이터 저장
			//서버에서 인식한 상품 정보와 일치하는지 확인 가능
			//customData: { item: item!.id },
			products:products,
			addressLine1 : user.address,
			redirectUrl : redirectUrl
		});

		if (payment.code !== undefined) {
			setPaymentStatus({ status: "FAILED", message: payment.message });
			return;
		}

		//   selectedItems.map(selItem => products.push(
		//    {
		//       id: selItem['id'],
		//       name: selItem['품명'],
		//       code: selItem['규격'],
		//       amount: selItem['수수료'],
		//       quantity: 1,
		//       tag: selItem['연번'],
		//       link: "https://shop.com/products/A1002"
		//   }
		// ))
		
		selectedItems.map(
			n => recode[n.id + "_" + n['품명'] + "_" + n['규격']] = parseInt(n['수수료'])
		)

		//여기서 order주문을 생성해야함
		const res = await axios.post(`/api/imgPermit/${confirm.jobid}`,confirm,{headers:{"Content-Type":'application/json'}})
				console.log("결제 창 내에 파이썬 응답",res.data)
				if (res.status ===200) {	
					const orderResp = await axios.post("/api/payment/order/create", {
						"caller": "string",
						"method": "read",
						"status": "200",
						"message": "success",
						"content": {
							"order": {
								"orderId": item?.id,
								"filePath": res.data.data.path,
								"totalPrice": selectedItems
									.flat()
									.reduce((total: number, item: any) => total + (parseInt(item.수수료) || 0), 0),
								"username": user.username,
								"itemPrice": recode
							}
						}
					}, {
						headers: {
							"Content-Type": "application/json",
							"Authorization": sessionStorage.getItem("jwtToken") || ""
						},
						withCredentials: true
					});
						console.log("결제 내용 DB저장 ", orderResp.data)
				}
				
		//결제 요청된 결과가 맞는지 확인
		const completeResponse = await fetch("/api/payment/complete", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ paymentId: payment.paymentId ,orderId : item?.id}),
		});

		if (completeResponse.ok) {
			const paymentComplete = await completeResponse.json();
			setPaymentStatus({ status: paymentComplete.status });
		} else {
			setPaymentStatus({
				status: "FAILED",
				message: await completeResponse.text(),
			});
		}
		} catch (error) {
			console.error("Payment error:", error);
			setPaymentStatus({
			status: "FAILED",
			message: "결제 처리 중 오류가 발생했습니다.",
			});
		}
	};

	const handleClose = () => {
		setPaymentStatus({ status: "IDLE" })
		window.location.href='/'
	};

	if (!selectedItems) {
		return (
		<dialog open>
			<article aria-busy>결제 정보를 불러오는 중입니다.</article>
		</dialog>
		);
	}

const isWaitingPayment = paymentStatus.status !== "IDLE";

return (
    <>
	{false ? (
        <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-gray-200 text-lg font-semibold">
		로딩중...
        </div>
	) : (
        <>
		<main>
            <form onSubmit={handleSubmit} className="space-y-6">
			<Button01
                caption={isWaitingPayment ? "결제 처리 중..." : "결제"}
                bg_color="blue" // glass_button_variants에 정의된 키 중 하나 사용
                onClick={(e) => {
				e.preventDefault();
				if (!isWaitingPayment) handleSubmit(e);
                }}
                disabled={isWaitingPayment}
			/>
            </form>
		</main>

          {/* 결제 실패 다이얼로그 */}
		{paymentStatus.status === "FAILED" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-11/12 max-w-sm shadow-lg">
                <header className="mb-4">
				<h1 className="text-lg font-bold text-red-600 dark:text-red-400">
                    결제 실패
				</h1>
                </header>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
				{paymentStatus.message}
                </p>
                <button
				type="button"
				onClick={handleClose}
				className="w-full py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
				닫기
                </button>
			</div>
            </div>
		)}

          {/* 결제 성공 다이얼로그 */}
		{paymentStatus.status === "PAID" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-11/12 max-w-sm shadow-lg">
                <header className="mb-4">
				<h1 className="text-lg font-bold text-green-600 dark:text-green-400">
                    결제 성공
				</h1>
                </header>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
				결제에 성공했습니다.
                </p>
                <button
				type="button"
				onClick={handleClose}
				className="w-full py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
				닫기
                </button>
			</div>
            </div>
		)}
        </>
	)}
    </>
);
}





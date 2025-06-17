'use client'; // 클라이언트 컴포넌트 선언
import PortOne from "@portone/browser-sdk/v2";
import { useEffect, useState, FormEvent } from "react";

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

export default function OrderPage()  {
  const [item, setItem] = useState<Item | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    status: "IDLE",
  });

  useEffect(() => {
    async function loadItem() {
      const response = await fetch("http://10.125.121.186:8080/api/item");
      const data: Item = await response.json();
    //   const data = {
    //             "Item": { 
    //                 "id": "1",
    //                 "name": "홍길동",
    //                 "price": "10000",
    //                 "currency": "KRW"
    //             }
    //         };
      setItem(data);
    }
    loadItem().catch((error) => console.error(error));
  }, []);

  function randomId() {
    return [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaymentStatus({ status: "PENDING" });


    
    try {
      const paymentId = randomId();
      const payment = await PortOne.requestPayment({
        storeId: process.env.STORE_ID, // 실제 값 입력 필요
        channelKey: process.env.CHANNEL_KEY, // 실제 값 입력 필요
        paymentId,
        orderName: item!.name,
        totalAmount: item!.price,
        currency: item!.currency,
        payMethod: "CARD",
        customData: { item: item!.id },
      });

      if (payment.code !== undefined) {
        setPaymentStatus({ status: "FAILED", message: payment.message });
        return;
      }

      const completeResponse = await fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: payment.paymentId }),
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

  const handleClose = () => setPaymentStatus({ status: "IDLE" });

  if (!item) {
    return (
      <dialog open>
        <article aria-busy>결제 정보를 불러오는 중입니다.</article>
      </dialog>
    );
  }

  const isWaitingPayment = paymentStatus.status !== "IDLE";

  return (
    <>
      <main>
        <form onSubmit={handleSubmit}>
          <article>
            <div className="item">
              <div className="item-image">
                <img src={`/${item.id}.png`} alt={item.name} />
              </div>
              <div className="item-text">
                <h5>{item.name}</h5>
                <p>{item.price.toLocaleString()}원</p>
              </div>
            </div>
            <div className="price">
              <label>총 구입 가격</label>
              {item.price.toLocaleString()}원
            </div>
          </article>
          <button
            type="submit"
            aria-busy={isWaitingPayment}
            disabled={isWaitingPayment}
            className="cursor-pointer"
          >
            결제
          </button>
        </form>
      </main>

      {paymentStatus.status === "FAILED" && (
        <dialog open>
          <header>
            <h1>결제 실패</h1>
          </header>
          <p>{paymentStatus.message}</p>
          <button type="button" onClick={handleClose}>
            닫기
          </button>
        </dialog>
      )}

      <dialog open={paymentStatus.status === "PAID"}>
        <header>
          <h1>결제 성공</h1>
        </header>
        <p>결제에 성공했습니다.</p>
        <button type="button" onClick={handleClose}>
          닫기
        </button>
      </dialog>
    </>
  );
}

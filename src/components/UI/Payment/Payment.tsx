"use client";

import React, { useState } from "react";
import Button01 from "@/components/etc/Button01";
import OrderPage from "@/components/order/OrderPage";
import { useFetchUser } from "@/hooks/useFetchUser";
import ItemList from "./ItemList";
import { toggleSelect } from "./toggleSelect";

export default function Payment({ onclose, data, originaldata }: { onclose: () => void; data: sqldata[]; originaldata: ImagePermitRequestDTO; }) {
	const [confirm, setconfirm] = useState<ImagePermitRequestDTO>(originaldata);

	const [sorteditmes, setsorteditmes] = useState<any>(
		data.map((i: any) => ({
			furnitureList: { ...i.furnitureList, index: i.index }
		}))
	)
	const [selectedData, setSelectedData] = useState<any[]>(data.map((item: any) => item.furnitureList)); // 초기값은 모두 선택된 상태

	const [selectedKeys, setSelectedKeys] = useState<string[]>(
		sorteditmes.map((i: any) => `${i.furnitureList.index}_${i.furnitureList.품명}_${i.furnitureList.규격}`)
	);
	const [totalFee, setTotalFee] = useState<number>(
		sorteditmes.reduce((acc: number, i: any) => {
				const fee = parseInt(i.furnitureList.수수료 || "0");
				return acc + (isNaN(fee) ? 0 : fee);
		}, 0)
	);
	const {user,loading} = useFetchUser()

	console.log('props data', data)
	console.log("originaldata", originaldata);
	console.log('sorteditmes',sorteditmes)
	console.log('confirm',confirm)
	console.log('user',user)
	console.log("selectedData",selectedData)

	return (
		<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8">
				<div className="border-b border-gray-300 pb-4 mb-6">
					<h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
						결제 상세
					</h2>
				</div>

				{/* 안내 문구 */}
				<div className="mb-6 text-center text-gray-600 text-sm sm:text-base leading-relaxed">
					품목을 클릭하여 <span className="font-semibold">선택하거나 해제</span>
					할 수 있습니다.
					<br />
					총 수수료는 선택된 품목들의 합계입니다.
				</div>
			 	{/* 아이템 리스트 */}
				<ItemList
					sorteditems={sorteditmes}
					selectedKeys={selectedKeys}
					onToggle={(key: string) =>
						toggleSelect(key, selectedKeys, setSelectedKeys, confirm, setconfirm, data ,originaldata,sorteditmes,setSelectedData,setTotalFee)
					}
				/>
				{/* 총 수수료 */}
				<div className="text-right text-xl sm:text-2xl font-bold text-gray-900 mb-8">
					총 수수료:{" "}
					<span className="text-blue-600">{totalFee.toLocaleString()}원</span>
				</div>

				{/* 버튼 그룹 */}
				<div className="flex justify-end space-x-4">
					{/* <Button01 caption="결제" bg_color="blue" onClick={handlePaymentClick} /> */}
					{user && <OrderPage selectedItems={selectedData} confirm={confirm} user={user}/>}
					<Button01 caption="닫기" bg_color="orange" onClick={onclose} />
				</div>
				
			</div>
			
		</div>
	);
}

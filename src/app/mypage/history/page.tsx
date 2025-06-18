"use client";

export default function HistoryPage() {
  const histories = [
    {
      id: 1,
      item: "책장 수거 요청",
      status: "처리 완료",
      date: "2025-06-15",
    },
    {
      id: 2,
      item: "냉장고 수거 요청",
      status: "접수 중",
      date: "2025-06-10",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl text-gray-700 font-bold">신청 내역</h1>
      <ul className="space-y-4">
        {histories.map((h) => (
          <li
            key={h.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between"
          >
            <div>
              <p className="font-semibold text-gray-700">{h.item}</p>
              <p className="text-sm text-gray-500">{h.date}</p>
            </div>
            <p
              className={`text-sm font-medium ${
                h.status === "처리 완료"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {h.status}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

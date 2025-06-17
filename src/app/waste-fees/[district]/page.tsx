import { getFeesByDistrict } from "@/lib/loadfee";

export default function DistrictPage({ params }: { params: { district: string } }) {
  const fees = getFeesByDistrict(decodeURIComponent(params.district));
  const districtName = decodeURIComponent(params.district);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        {districtName} 대형 폐기물 수수료 목록
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-md border border-blue-900 bg-[#1e293b]/80">
        <table className="w-full text-sm text-left text-gray-200">
          <thead className="bg-[#334155]/80 text-blue-100">
            <tr>
              <th className="px-4 py-3 border border-blue-900">품목</th>
              <th className="px-4 py-3 border border-blue-900">규격</th>
              <th className="px-4 py-3 border border-blue-900">수수료 (원)</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((item, idx) => (
              <tr
                key={idx}
                className={
                  idx % 2 === 0 ? "bg-[#1e293b]/50" : "bg-[#0f172a]/50"
                }
              >
                <td className="px-4 py-2 border border-blue-900 whitespace-nowrap">
                  {item.대형폐기물명}
                </td>
                <td className="px-4 py-2 border border-blue-900 whitespace-nowrap">
                  {item.대형폐기물규격}
                </td>
                <td className="px-4 py-2 border border-blue-900 text-right">
                  {Number(item.수수료).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

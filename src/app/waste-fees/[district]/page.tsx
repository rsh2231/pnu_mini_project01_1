import { getFeesByDistrict } from "@/lib/loadfee";

export default function DistrictPage({ params }: { params: { district: string } }) {
  const fees = getFeesByDistrict(decodeURIComponent(params.district));

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{params.district} 수수료 목록</h1>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">품목</th>
            <th className="border p-2">규격</th>
            <th className="border p-2">수수료 (원)</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{item.대형폐기물명}</td>
              <td className="border p-2">{item.대형폐기물규격}</td>
              <td className="border p-2">{Number(item.수수료).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

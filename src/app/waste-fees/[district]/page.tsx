import { getFeesByDistrict } from "@/lib/loadfee";
import FeeTable from "@/components/wastefee/FeeTable";

export default function DistrictPage({ params }: { params: { district: string } }) {
  const districtName = decodeURIComponent(params.district);
  const fees = getFeesByDistrict(districtName);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        {districtName} 대형 폐기물 수수료 목록
      </h1>
      <FeeTable fees={fees} />
    </div>
  );
}

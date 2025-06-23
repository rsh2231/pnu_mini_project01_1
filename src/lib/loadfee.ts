import wasteFeeData from "@/data/waste-fees.json";

export interface WasteFee {
  시도명: string;
  시군구명: string;
  대형폐기물명: string;
  대형폐기물규격: string;
  수수료: string;
}

export function getDistricts(): string[] {
  const all = wasteFeeData.records as WasteFee[];
  const busan = all.filter((r) => r.시도명 === "부산광역시");
  const unique = [...new Set(busan.map((r) => r.시군구명))];
  return unique;
}

export function getFeesByDistrict(district: string): WasteFee[] {
  const all = wasteFeeData.records as WasteFee[];
  return all.filter(
    (r) => r.시도명 === "부산광역시" && r.시군구명 === district
  );
}

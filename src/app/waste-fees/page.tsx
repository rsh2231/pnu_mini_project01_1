import Link from "next/link";
import { getDistricts } from "@/lib/loadfee";

export default function WasteFeesHomePage() {
  const districts = getDistricts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">부산시 구·군 목록</h1>
      <ul className="space-y-2">
        {districts.map((name) => (
          <li key={name}>
            <Link href={`/waste-fees/${encodeURIComponent(name)}`} className="text-blue-600 hover:underline">
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

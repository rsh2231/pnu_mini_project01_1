type FeeItem = {
  대형폐기물명: string;
  대형폐기물규격: string;
  수수료: number | string;
};

export default function FeeTable({
  fees,
  title,
}: {
  fees: FeeItem[];
  title?: string;
}) {
  const groupedByName: Record<string, FeeItem[]> = {};
  fees.forEach((fee) => {
    if (!groupedByName[fee.대형폐기물명]) groupedByName[fee.대형폐기물명] = [];
    groupedByName[fee.대형폐기물명].push(fee);
  });

  return (
    // 부모의 overflow-x-auto는 만약을 위한 안전장치로 유지합니다.
    <section className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-md border border-blue-800/40 text-white rounded-2xl shadow-xl p-4 sm:p-6 overflow-x-auto">
      {title && (
        <h2 className="text-lg sm:text-2xl font-bold text-cyan-300 mb-6 text-center tracking-tight">
          {title}
        </h2>
      )}

      {/* 1. min-w-[480px] 제거, table-fixed 추가 */}
      <table className="w-full table-fixed text-sm sm:text-base border-separate border-spacing-0">
        <thead>
          <tr className="bg-[#334155]/80 text-cyan-100 text-center">
            {/* 2. 각 th에 너비 비율 지정 */}
            <th className="w-2/5 px-3 py-2 border border-blue-800 rounded-tl-md">
              품목
            </th>
            <th className="w-2/5 px-3 py-2 border border-blue-800">규격</th>
            <th className="w-1/5 px-3 py-2 border border-blue-800 rounded-tr-md">
              수수료
            </th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(groupedByName).map(([name, items]) =>
            items.map((item, idx) => (
              <tr
                key={`${name}-${idx}`}
                className="bg-[#1e293b]/60 hover:bg-[#1e3a8a]/40 transition-colors text-center"
              >
                {idx === 0 && (
                  <td
                    rowSpan={items.length}
                    // 3. break-all 추가로 긴 단어 강제 줄바꿈
                    className="px-3 py-2 border border-blue-800 font-medium align-middle text-white break-all"
                  >
                    {name}
                  </td>
                )}
                <td className="px-3 py-2 border border-blue-800 text-slate-200 break-all">
                  {item.대형폐기물규격}
                </td>
                <td className="px-3 py-2 border border-blue-800 text-slate-100">
                  {Number(item.수수료).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
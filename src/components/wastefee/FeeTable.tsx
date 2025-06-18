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
    <div className="bg-[#1e293b]/80 shadow-md rounded-lg border border-blue-900 p-4 sm:p-6 overflow-x-auto">
      {title && (
        <h2 className="text-lg sm:text-2xl font-semibold text-white mb-4 text-center">
          {title}
        </h2>
      )}
      <table className="min-w-[480px] w-full text-xs sm:text-sm border-collapse border border-blue-900">
        <thead className="bg-[#334155]/90 text-blue-100">
          <tr>
            <th className="px-2 sm:px-4 py-1 sm:py-2 border border-blue-900 text-center">
              품목
            </th>
            <th className="px-2 sm:px-4 py-1 sm:py-2 border border-blue-900 text-center">
              규격
            </th>
            <th className="px-2 sm:px-4 py-1 sm:py-2 border border-blue-900 text-center">
              수수료 (원)
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByName).map(([name, items]) =>
            items.map((item, idx) => (
              <tr key={`${name}-${idx}`} className="bg-[#1e293b]/50">
                {idx === 0 && (
                  <td
                    rowSpan={items.length}
                    className="px-2 sm:px-4 py-1 sm:py-2 border border-blue-900 text-center align-middle"
                  >
                    {name}
                  </td>
                )}
                <td className="px-2 sm:px-4 py-1 sm:py-2 border border-blue-900 text-center">
                  {item.대형폐기물규격}
                </td>
                <td className="px-2 sm:px-4 py-1 sm:py-2 border border-blue-900 text-center">
                  {Number(item.수수료).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

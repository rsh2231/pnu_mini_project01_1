export default function WasteInfoBox() {
  return (
    <div className="bg-[#0f172a]/80 text-blue-100 border-l-4 border-cyan-300 p-4 sm:p-6 rounded-lg shadow mb-8 sm:mb-10">
      <h2 className="text-2xl sm:text-4xl text-white font-semibold mb-2 sm:mb-4">
        대형폐기물이란?
      </h2>
      <p className="mb-2 sm:mb-1 text-lg sm:text-2xl text-white">
        크기와 상관없이 <strong>종량제봉투로 배출해서는 안되는 폐기물</strong>을 말합니다.
      </p>
      <ul className="list-disc list-inside space-y-1 text-base sm:text-xl text-white">
        <li>이불, 베개, 담요 등 원단류 및 솜</li>
        <li>가구, 사무용 기자재, 생활용품 등 품명식별이 가능한 폐기물</li>
        <li>
          예: 나무, 전기방석, 장난감, 우산, 장판, 도배지, 가방, 액자, 쿠션, 벽시계, 폐소화기 등
        </li>
      </ul>
    </div>
  );
}

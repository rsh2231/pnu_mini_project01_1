export default function WasteInfoBox() {
  return (
    <section className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 backdrop-blur-sm border border-cyan-500/30 text-white rounded-2xl shadow-xl px-5 py-6 sm:px-8 sm:py-10 space-y-5 sm:space-y-6">
      <h2 className="text-2xl sm:text-4xl font-bold text-cyan-300 tracking-tight">
        대형폐기물이란?
      </h2>

      <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
        크기와 상관없이{" "}
        <strong className="text-white font-semibold underline underline-offset-4 decoration-cyan-400">
          종량제봉투로 배출해서는 안되는 폐기물
        </strong>
        을 말합니다.
      </p>

      <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-100 marker:text-cyan-400">
        <li>이불, 베개, 담요 등 원단류 및 솜</li>
        <li>가구, 사무용 기자재, 생활용품 등 품명식별이 가능한 폐기물</li>
        <li>
          예: 나무, 전기방석, 장난감, 우산, 장판, 도배지, 가방, 액자, 쿠션, 벽시계, 폐소화기 등
        </li>
      </ul>
    </section>
  );
}

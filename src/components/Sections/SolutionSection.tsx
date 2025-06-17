export default function SolutionSection() {
  return (
    <section id="solution" className="p-40 bg-slate-100">
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            WasteSort의 스마트한 해결책
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            복잡하고 번거로운 폐기물 처리 과정, WasteSort가 혁신합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4 text-blue-600">🤖</div>
            <h3 className="text-2xl font-bold mb-3">AI 기반 자동 분류</h3>
            <p className="text-gray-600">
              폐기물 사진 한 장이면 끝. 강력한 AI가 폐기물 종류를 정확하게
              분류하고 올바른 배출 방법을 안내합니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4 text-green-600">💳</div>
            <h3 className="text-2xl font-bold mb-3">간편 신고 및 결제</h3>
            <p className="text-gray-600">
              복잡한 행정 절차는 이제 그만. 분류된 폐기물 신고부터 수수료
              결제까지 온라인에서 원클릭으로 해결하세요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4 text-orange-500">🤝</div>
            <h3 className="text-2xl font-bold mb-3">대형 폐기물 나눔</h3>
            <p className="text-gray-600">
              버리기엔 아깝다면? 나눔 게시판을 통해 필요한 이웃에게 대형 폐기물을
              판매하거나 무료로 나눌 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

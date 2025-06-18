export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white text-gray-900 px-6 py-10 md:p-40">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold">단 3단계면 충분합니다</h2>
          <p className="text-base md:text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            누구나 쉽게 따라할 수 있는 간편한 프로세스.
          </p>
        </div>

        <div className="relative">
          {/* Dotted line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 border-t-2 border-dashed border-gray-300 -translate-y-1/2"></div>

          <div className="grid gap-y-12 md:grid-cols-3 md:gap-x-16 text-center relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-white shadow-lg mb-4">
                1
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">대형 폐기물 촬영 및 업로드</h3>
              <p className="text-gray-600 text-sm md:text-base">
                스마트폰으로 버릴 폐기물을 <br />
                찍어 업로드해주세요.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-white shadow-lg mb-4">
                2
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">AI 자동 분류 및 확인</h3>
              <p className="text-gray-600 text-sm md:text-base">
                AI가 폐기물 종류와 배출 수수료를 <br />
                즉시 알려줍니다.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-white shadow-lg mb-4">
                3
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">신고 및 결제 완료</h3>
              <p className="text-gray-600 text-sm md:text-base">
                간편 결제로 수수료를 납부하고 <br />
                배출 신고를 완료하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

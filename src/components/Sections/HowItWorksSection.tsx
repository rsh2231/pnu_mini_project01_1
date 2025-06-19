export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white text-gray-900 px-6 py-10 md:px-20 md:py-24">
      <div className="max-w-screen-lg mx-auto">
        {/* 제목 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold">단 3단계면 충분합니다</h2>
          <p className="text-base md:text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            누구나 쉽게 따라할 수 있는 간편한 프로세스.
          </p>
        </div>

        <div className="grid gap-y-20 md:grid-cols-3 md:gap-x-12 text-center relative z-10">
          {[
            {
              step: 1,
              title: "대형 폐기물 촬영 및 업로드",
              desc: "스마트폰으로 버릴 폐기물을 \n찍어 업로드해주세요.",
              image: "/images/step1.jpg",
            },
            {
              step: 2,
              title: "AI 자동 분류 및 확인",
              desc: "AI가 폐기물 종류와 배출 수수료를 \n즉시 알려줍니다.",
              image: "/images/step2.png",
            },
            {
              step: 3,
              title: "신고 및 결제 완료",
              desc: "간편 결제로 수수료를 납부하고 \n배출 신고를 완료하세요.",
              image: "/images/step3.png",
            },
          ].map(({ step, title, desc, image }, index, arr) => (
            <div key={step} className="flex flex-col items-center relative">
              {/* Step 넘버 */}
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl md:text-4xl font-bold border-4 border-white shadow-lg mb-4 z-10">
                {step}
              </div>

              {/* 점선 라인 (PC에서만, 마지막 step 제외) */}
              {index < arr.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full border-t-2 border-dashed border-gray-300 z-0"></div>
              )}

              {/* 이미지 */}
              <div className="w-[260px] h-[380px] bg-gray-100 rounded-xl shadow-md mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={image}
                  alt={`Step ${step}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* 텍스트 */}
              <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600 text-sm md:text-base whitespace-pre-line">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

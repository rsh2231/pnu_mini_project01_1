export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
      <p className="text-xl text-gray-700 font-semibold tracking-wide">
        결과를 불러오는 중입니다... <br /> 약 10초 소요
      </p>
    </div>
  );
}

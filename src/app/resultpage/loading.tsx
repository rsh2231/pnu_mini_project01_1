export default function loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a]">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-400 border-opacity-30 animate-spin"></div>
      </div>
      <p className="text-2xl md:text-3xl font-semibold text-white animate-pulse">
        결과를 불러오는 중입니다... 약 10초 소요
      </p>
    </div>
  );
}

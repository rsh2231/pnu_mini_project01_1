export default function loading() {
     return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-opacity-25 animate-spin"></div>
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 animate-pulse">
                결과를 불러오는 중입니다... 약 10초 소요
            </p>
        </div>
    );
}
import ImageSendingForm from "@/components/UI/ImageForm/ImageSendingForm";
import Nav from "@/components/UI/Nav/Nav";
import Image from "next/image";


export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      {/* 타이틀 영역 */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight drop-shadow-lg">
          ♻ 부산 폐기물 자동 분류 시스템
        </h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          폐기물 이미지를 업로드하면 종류를 자동 분류하고, <br />
          지자체 신고와 결제를 간편하게 처리합니다.
        </p>
      </section>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ImageSendingForm/>
      </main>
    </div>
  );
}

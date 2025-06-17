"use client";

import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import ImageSendingForm from "@/components/UI/ImageForm/ImageSendingForm";
import HowItWorksSection from "@/components/Sections/HowItWorksSection";
import SolutionSection from "@/components/Sections/SolutionSection";
import HeroSection from "@/components/Sections/HeroSection";

export default function Home() {
  const [loginstate] = useAtom(isLoginAtom);

  return (
    <main className="w-full flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Solution Section */}

      <SolutionSection />
      
      {/* How it works Section */}
      <HowItWorksSection />
    </main>
  );
}

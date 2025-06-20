"use client";

import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import HowItWorksSection from "@/components/Sections/HowItWorksSection";
import SolutionSection from "@/components/Sections/SolutionSection";
import MainSection from "@/components/Sections/MainSection";

export default function Home() {
  const [loginstate] = useAtom(isLoginAtom);

  return (
    <div className="w-full flex flex-col">
      {/* Main Section */}
      <MainSection />
      

      {/* Solution Section */}

      <SolutionSection />
      
      {/* How it works Section */}
      <HowItWorksSection />
    </div>
  );
}

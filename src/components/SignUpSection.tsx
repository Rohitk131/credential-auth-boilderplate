"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";
import SignUpCard from '@/components/SignupCard'
export default function SparklesPreview() {
  return (
    <div className="h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden ">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#7DF9FF"
        />
      </div>
      <div className="z-50">
      <SignUpCard/>
      </div>
    </div>
  );
}

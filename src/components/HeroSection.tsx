"use client";
import React from "react";
import { SparklesCore } from "./ui/sparkles";
import Buttons from './Buttons';
export default function SparklesPreview() {
  return (
    <div className="h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden ">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={10}
          maxSize={15}
          particleDensity={2}
          className="w-full h-full"
          particleColor="#AED6F1"
        />
      </div>
      <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
        PaisaKhooz
      </h1>
      <Buttons/>
    </div>
  );
}

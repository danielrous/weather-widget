"use client";

import type React from "react";
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// weather effects
import { CloudyParticles } from "./weatherv1/Cloudy";
import { RainParticles } from "./weatherv1/Rainy";
import { SunnyParticles } from "./weatherv1/Sunny";
import { WindParticles } from "./weatherv1/Windy";
// icons
import { Sun, CloudRain, Thermometer, Cloud, Wind } from "lucide-react";
import CanvasCloudSystem from "./weatherv2/CanvasCloudSystem";
import WindStreaks from "./weatherv2/WindStreaks";

type WeatherState = "sunny" | "rainy" | "windy" | "cloudy";

export default function WeatherWidgetV1() {
  const [currentWeather, setCurrentWeather] = useState<WeatherState>("sunny");
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ width: 320, height: 400 });
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCardSize({ width, height });
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  //clean up lingering wind streaks when switching weather
  useEffect(() => {
    setClickPosition(null);
  }, [currentWeather]);

  const weatherStates = {
    sunny: {
      icon: Sun,
      SunBgColor: "bg-yellow-400",
      color: "backdrop-blur-sm bg-zinc-100/20 border border-zinc-100/40",
      bgColor: "bg-gradient-to-b from-[#E5681F] via-[#F5BA3C] to-[#FEFDF6]",
      temp: "24°C",
      description: "Sunny & Bright",
    },
    cloudy: {
      icon: Cloud,
      SunBgColor: "bg-zinc-500",
      color: "backdrop-blur-sm bg-zinc-100/20 border border-zinc-100/40",
      bgColor: "bg-gradient-to-b from-zinc-500 via-zinc-300 to-zinc-100",
      temp: "18°C",
      description: "Partly Cloudy",
    },
    rainy: {
      icon: CloudRain,
      SunBgColor: "bg-slate-500",
      color: "backdrop-blur-sm bg-zinc-100/20 border border-zinc-100/40",
      bgColor: "bg-gradient-to-b from-slate-700 via-slate-400 to-slate-200",
      temp: "15°C",
      description: "Light Rain",
    },
    windy: {
      icon: Wind,
      SunBgColor: "bg-slate-300",
      color: "backdrop-blur-sm bg-zinc-100/20 border border-zinc-100/40",
      bgColor: "bg-gradient-to-b from-slate-400 via-slate-100 to-slate-100",
      temp: "20°C",
      description: "Breezy",
    },
  };

  const currentState = weatherStates[currentWeather];

  return (
    <main className="relative">
      <Card
        ref={containerRef}
        className="absolute left-1/2 rounded-3xl border-border outline-ring/50 -translate-x-1/2 w-80 aspect-[3/4] md:w-100 lg:w-180 lg:aspect-[4/3] md:aspect-[3/4] overflow-hidden cursor-pointer transition-all duration-500"
      >
        {/* Animated Background */}
        {(Object.keys(weatherStates) as WeatherState[]).map((weather) => (
          <div
            key={weather}
            className={`
                      absolute inset-0 transition-opacity duration-1000 pointer-events-none
                      ${currentWeather === weather ? "opacity-100" : "opacity-0"}
                      ${weatherStates[weather].bgColor}
                    `}
          />
        ))}

        {/* Cloudy particles */}
        {currentWeather === "cloudy" && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <CloudyParticles number={25} cardWidth={cardSize.width} cardHeight={cardSize.height} />
          </div>
        )}

        {/* Rainy particles */}
        {currentWeather === "rainy" && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <RainParticles number={100} angle={0} cardWidth={cardSize.width} cardHeight={cardSize.height} />
          </div>
        )}

        {/* Windy particles */}
        {currentWeather === "windy" && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-visible">
            <WindParticles number={100} angle={190} minDuration={2} maxDuration={12} cardWidth={cardSize.width} cardHeight={cardSize.height} />
          </div>
        )}

        {/* Sunny */}
        {currentWeather === "sunny" && (
          <div className="absolute inset-0 z-10 pointer-events-auto overflow-visible">
            {/* Sunny Particles */}
            <SunnyParticles number={25} cardWidth={cardSize.width} cardHeight={cardSize.height} />
            {/* Cloudy Particles */}
            <div className="pointer-events-auto">
              <CloudyParticles number={2} raininess={0} cardWidth={cardSize.width} cardHeight={cardSize.height} />
            </div>
          </div>
        )}

        {/* Sun */}
        <div className="absolute z-5 top-8 left-1/2 transform -translate-x-1/2">
          <div className="relative size-24">
            {(Object.keys(weatherStates) as WeatherState[]).map((weather) => (
              <div
                key={weather}
                className={`
                  absolute inset-0 p-4 rounded-full shadow-lg transition-opacity duration-1000
                  ${weatherStates[weather].SunBgColor}
                  ${currentWeather === weather ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
          </div>
        </div>

        {/* Temperature info */}
        <div className="absolute z-0 w-full px-3 top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
          <div className=" pb-4 border-none">
            <div className="flex flex-col items-center justify-center gap-2 mb-2">
              <span className="text-8xl font-bold font-mono text-white/50 tracking-tight">{currentState.temp}</span>
              <span className="text-4xl uppercase font-bold font-mono text-white/50 tracking-tight">{currentState.description}</span>
            </div>
          </div>
        </div>

        {/* Weather State Buttons */}
        <div className="absolute bottom-0 left-0 w-full z-100 px-3 pb-3 flex justify-between gap-2">
          {(Object.keys(weatherStates) as WeatherState[]).map((weather) => {
            const StateIcon = weatherStates[weather].icon;
            return (
              <Button key={weather} variant={currentWeather === weather ? "secondary" : "primary"} size="lg" onClick={() => setCurrentWeather(weather)} className="w-full rounded-xl flex-1 p-2">
                <StateIcon size={16} />
              </Button>
            );
          })}
        </div>
      </Card>
    </main>
  );
}

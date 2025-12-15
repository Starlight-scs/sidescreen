'use client';

import CalendarPanel from '@/app/components/CalendarPanel';
import { ClockCard } from '@/app/components/ClockCard';
import WeatherCard from '@/app/components/WeatherCard';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black text-white overflow-hidden">
      <main className="flex flex-col h-full w-full md:w-2/3 bg-black border border-neutral-800 rounded-lg shadow-lg overflow-hidden">
        {/* CLOCK SECTION */}
        <div className="flex flex-col items-center justify-center flex-[2] border-b border-neutral-800 p-4">
          <div className="h-full w-[85%] flex items-center justify-center border border-neutral-700 rounded-lg bg-neutral-900/20">
            <div className="text-5xl md:text-6xl font-bold">
              <ClockCard />
            </div>
          </div>
        </div>

        {/* CALENDAR SECTION */}
        <div className="flex flex-col items-center justify-center flex-[3] border-b border-neutral-800 p-4">
          <div className="h-full w-[90%] flex items-center justify-center border border-neutral-700 rounded-lg bg-neutral-900/20 overflow-hidden">
            <CalendarPanel />
          </div>
        </div>

        {/* WEATHER SECTION */}
        <div className="flex flex-col items-center justify-center flex-[2] border-b border-neutral-800 p-4">
          <div className="h-full w-[85%] flex items-center justify-center border border-neutral-700 rounded-lg bg-neutral-900/20 p-4">
            <WeatherCard />
          </div>
        </div>

        {/* MAP SECTION — LARGEST */}
        <div className="flex flex-col items-center justify-center flex-[5] p-4">
          <div className="h-full w-[90%] flex items-center justify-center border border-neutral-700 rounded-lg bg-neutral-900/20 p-4 overflow-hidden">
            <img
              src="/132%20S%20Water%20St%20Screen_2.png"
              alt="132 S Water St building"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import CalendarPanel from '@/app/components/CalendarPanel';
import { ClockCard } from '@/app/components/ClockCard';
import WeatherCard from '@/app/components/WeatherCard';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
      {/* MAIN CONTAINER */}
      <div
        className="flex flex-col items-center justify-between
                   bg-black border border-neutral-700 rounded-lg overflow-hidden shadow-md"
        style={{
          width: '320px',
          height: '740px',
        }}
      >
        {/* Header */}
        <div className="py-2 w-full text-center border-b border-neutral-700 bg-black">
          <h1 className="text-xl font-bold tracking-wide text-white">

          </h1>
        </div>

        {/* CLOCK */}
        <div className="w-full flex-1 flex items-center justify-center bg-black border-b border-neutral-800">
          <ClockCard />
        </div>

        {/* CALENDAR */}
        <div className="w-full flex-1 flex items-center justify-center bg-black border-b border-neutral-800">
          <CalendarPanel />
        </div>

        {/* WEATHER */}
        <div className="w-full flex-1 flex items-center justify-center bg-black">
          <WeatherCard />
        </div>
      </div>
    </div>
  );
}
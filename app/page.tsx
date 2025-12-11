'use client';

import CalendarPanel from '@/app/components/CalendarPanel';
import { ClockCard } from '@/app/components/ClockCard';
import WeatherCard from '@/app/components/WeatherCard';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
      {/* OUTER WRAPPER — 30% width, 100% height */}
      <div className="flex flex-col h-screen w-[60%] bg-black overflow-hidden border border-neutral-800 rounded-lg shadow-lg">
        <main className="flex flex-col flex-1 h-full">
          {/* CLOCK — 20% of the wrapper height */}
          <section
            className="flex items-center justify-center border-b border-neutral-800"
            style={{ height: '10%' }}
          >
            <div className="flex items-center justify-center h-[85%] w-[85%] text-6xl md:text-8xl font-bold">
              <ClockCard />
            </div>
          </section>

          {/* CALENDAR + WEATHER STACKED (60% height total) */}
          <section
            className="flex flex-col items-center justify-center border-b border-neutral-800 space-y-6"
            style={{ height: '70%' }}
          >
            <div className="flex flex-col items-center justify-center h-[90%] w-[85%] space-y-6">
              {/* CALENDAR */}
              <div className="flex items-center justify-center h-[50%] w-full">
                <CalendarPanel />
              </div>

              {/* WEATHER */}
              <div className="flex items-center justify-center h-[70%] w-full">
                <WeatherCard />
              </div>
            </div>
          </section>

          {/* BUILDING MAP PLACEHOLDER (20% height) */}
          <section
            className="flex items-center justify-center h-[20%] w-full text-neutral-500 border-t border-neutral-800"
          >
            <div className="h-[90%] w-[85%] flex items-center justify-center border border-dashed border-neutral-700 rounded-lg">
              <p className="text-lg md:text-2xl italic">
                [ Building Map Coming Soon ]
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
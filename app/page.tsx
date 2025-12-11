'use client';

import CalendarPanel from '@/app/components/CalendarPanel';
import { ClockCard } from '@/app/components/ClockCard';
import WeatherCard from '@/app/components/WeatherCard';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
      {/* MAIN CONTAINER */}
      <div className="flex flex-col w-full h-full bg-black overflow-hidden">
        <main className="flex flex-col flex-1 h-full">
          {/* CLOCK — 20% of height */}
          <section
            className="flex items-center justify-center border-b border-neutral-800"
            style={{ height: '20%' }}
          >
            <div className="flex items-center justify-center h-[80%] w-[80%]">
              <ClockCard />
            </div>
          </section>

          {/* BOTTOM SECTION — remaining 80% split between calendar and weather */}
          <section
            className="flex flex-col flex-1 gap-4" // << adds spacing between them
            style={{ height: '80%' }}
          >
            {/* CALENDAR (60% of lower area) */}
            <div
              className="flex items-center justify-center border-b border-neutral-800"
              style={{ height: '60%' }}
            >
              <div className="flex items-center justify-center h-[70%] w-[80%]">
                <CalendarPanel />
              </div>
            </div>

            {/* WEATHER (40% of lower area) */}
            <div
              className="flex items-center justify-center"
              style={{ height: '50%' }}
            >
              <div className="flex items-center justify-center h-[60%] w-[80%]">
                <WeatherCard />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
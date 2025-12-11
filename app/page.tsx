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
          <section className="flex items-center justify-center border-b border-neutral-800" style={{ height: '20%' }}>
            <ClockCard />
          </section>

          {/* BOTTOM SECTION — remaining 80% split between calendar and weather */}
          <section className="flex flex-col flex-1" style={{ height: '80%' }}>
            {/* CALENDAR (60% of lower area) */}
            <div className="flex items-center justify-center border-b border-neutral-800" style={{ height: '60%' }}>
              <CalendarPanel />
            </div>

            {/* WEATHER (40% of lower area) */}
            <div className="flex items-center justify-center" style={{ height: '40%' }}>
              <WeatherCard />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
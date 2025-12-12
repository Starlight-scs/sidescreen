'use client';

import CalendarPanel from '@/app/components/CalendarPanel';
import { ClockCard } from '@/app/components/ClockCard';
import WeatherCard from '@/app/components/WeatherCard';

export default function HomePage() {
  return (
      <div className="flex items-center justify-center w-screen h-screen bg-black text-white">
      {/* OUTER WRAPPER — ~50% width, 100% height */}
      <div className="flex flex-col h-full w-full md:w-1/2 bg-black overflow-hidden border border-neutral-800 rounded-lg shadow-lg">

          {/* CLOCK */}
          <section className="flex items-center justify-center flex-[2] border-b border-neutral-800">
            <div className="h-[85%] w-[85%] flex items-center justify-center border border-neutral-700 rounded-lg bg-neutral-900/20">
              <div className="text-6xl md:text-8xl font-bold">
                <ClockCard />
              </div>
            </div>
          </section>

          {/* CALENDAR */}
          <section className="flex items-center justify-center flex-[4] border-b border-neutral-800">
            <div className="h-[85%] w-[85%] flex items-center justify-center border border-neutral-700 rounded-lg bg-neutral-900/20 overflow-hidden">
              <div className="h-full w-full">
                <CalendarPanel />
              </div>
            </div>
          </section>

          {/* WEATHER */}
          <section className="flex items-center justify-center flex-[4] border-b border-neutral-800">
            <div className="h-[85%] w-[85%] flex items-center justify-center border border-neutral-700 rounded-lg bg-neutral-900/20 overflow-hidden">
              <div className="h-full w-full">
                <WeatherCard />
              </div>
            </div>
          </section>

          {/* BUILDING MAP */}
            <section className="flex items-center justify-center flex-[3]">
  <div className="h-[90%] w-[92%] border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900/20">
    <div className="h-full w-full grid place-items-center">
      <img
        src="/132%20S%20Water%20St%20Screen_2.png"
        alt="132 S Water St building"
        className="max-h-full max-w-full object-cover"
      />
    </div>
  </div>
</section>


      </div>
    </div>
  );
}
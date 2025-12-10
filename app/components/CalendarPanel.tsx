"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import WeatherCard from "@/app/components/WeatherCard";
import { ClockCard } from "@/app/components/ClockCard";

export default function CalendarPanel() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col items-center w-full text-white p-1">


      {/* CALENDAR SECTION */}
      <div className="flex flex-col items-center">
        <div className="scale-[0.88] origin-top">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border border-neutral-700 shadow-sm bg-neutral-950 text-white"
          />
        </div>

        {date && (
          <p className="mt-1 text-xs text-neutral-400 text-center truncate">
            {date.toDateString()}
          </p>
        )}
      </div>

      {/* WEATHER SECTION */}
      <div className="flex justify-center mt-1">
        <div className="scale-[0.88] origin-top">
          <WeatherCard />
        </div>
      </div>
    </div>
  );
}
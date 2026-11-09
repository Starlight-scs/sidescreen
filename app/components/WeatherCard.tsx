'use client';

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface GoogleWeatherResponse {
  temperature: { degrees: number; unit: string };
  feelsLikeTemperature: { degrees: number; unit: string };
  weatherCondition: {
    iconBaseUri: string;
    description: { text: string };
  };
  wind: {
    direction: { cardinal: string };
    speed: { value: number; unit: string };
  };
  relativeHumidity: number;
}

interface ForecastDay {
  displayDate: { year: number; month: number; day: number };
  maxTemperature?: { degrees: number; unit: string };
  minTemperature?: { degrees: number; unit: string };
  daytimeForecast?: {
    weatherCondition?: { iconBaseUri: string; description: { text: string } };
    precipitation?: { probability?: { percent: number } };
  };
}

interface ForecastResponse {
  forecastDays: ForecastDay[];
}

// Lobby screens stay open for days without a reload, so the card must refresh
// itself. 30 min for current conditions keeps us far inside the free quota.
const REFRESH_MS = 30 * 60 * 1000;
// The 5-day outlook barely moves — 3 hours is plenty and costs ~8 calls/day.
const FORECAST_REFRESH_MS = 3 * 60 * 60 * 1000;
// If the newest successful reading gets older than this, say so on screen
// rather than silently presenting stale weather as current.
const STALE_MS = 95 * 60 * 1000;

const LAT = 39.8403;
const LNG = -88.9548;

// Google returns IMPERIAL when asked, but never trust the unit blindly.
const asF = (t?: { degrees: number; unit: string }) => {
  if (!t) return null;
  const u = (t.unit || "").toUpperCase();
  return u.startsWith("C") ? t.degrees * (9 / 5) + 32 : t.degrees;
};

const WeatherCard: React.FC = () => {
  const [data, setData] = useState<GoogleWeatherResponse | null>(null);
  const [days, setDays] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  // Guards against overlapping fetches (interval + visibility can race).
  const inFlight = useRef(false);
  const forecastInFlight = useRef(false);

  const fetchWeather = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${apiKey}&location.latitude=${LAT}&location.longitude=${LNG}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok)
        throw new Error(
          json?.error?.message || `Failed with ${res.status}: ${res.statusText}`
        );

      setData(json);
      setUpdatedAt(new Date());
      setError(null);
    } catch (err: unknown) {
      // Keep the last good reading on screen instead of blanking the panel.
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async () => {
    if (forecastInFlight.current) return;
    forecastInFlight.current = true;
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const url = `https://weather.googleapis.com/v1/forecast/days:lookup?key=${apiKey}&location.latitude=${LAT}&location.longitude=${LNG}&days=5&unitsSystem=IMPERIAL`;
      const res = await fetch(url, { cache: "no-store" });
      const json: ForecastResponse = await res.json();
      if (!res.ok) throw new Error("forecast lookup failed");
      // Keep the previous strip if a refresh comes back empty.
      if (Array.isArray(json.forecastDays) && json.forecastDays.length)
        setDays(json.forecastDays.slice(0, 5));
    } catch {
      // Non-fatal: the current-conditions row still carries the panel.
    } finally {
      forecastInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    setNow(new Date());
    fetchWeather();
    fetchForecast();

    const poll = setInterval(fetchWeather, REFRESH_MS);
    const forecastPoll = setInterval(fetchForecast, FORECAST_REFRESH_MS);
    // Drives the "updated / stale" label without re-fetching.
    const tick = setInterval(() => setNow(new Date()), 30 * 1000);

    // A screen that was asleep, offline, or backgrounded catches up instantly.
    const catchUp = () => {
      if (document.visibilityState === "visible") fetchWeather();
    };
    document.addEventListener("visibilitychange", catchUp);
    window.addEventListener("focus", catchUp);
    window.addEventListener("online", fetchWeather);

    return () => {
      clearInterval(poll);
      clearInterval(forecastPoll);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", catchUp);
      window.removeEventListener("focus", catchUp);
      window.removeEventListener("online", fetchWeather);
    };
  }, [fetchWeather, fetchForecast]);

  const toMph = (kmh: number) => (kmh / 1.609).toFixed(0);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-neutral-800 p-2 rounded-lg shadow-lg border border-neutral-700 text-white w-full max-w-[85%] mt-6 mx-auto">
      {children}
    </div>
  );

  // Only show a bare error card when we have never had a reading at all.
  if (loading && !data)
    return (
      <Wrapper>
        <div className="text-center text-neutral-300">
          Loading weather data...
        </div>
      </Wrapper>
    );

  if (!data)
    return (
      <Wrapper>
        <div className="text-center text-red-400">
          {error ? `Error: ${error}` : "No data available"}
        </div>
      </Wrapper>
    );

  const tempF = (asF(data.temperature) ?? 0).toFixed(0);
  const feelsF = (asF(data.feelsLikeTemperature) ?? 0).toFixed(0);
  const desc = data.weatherCondition.description.text;
  const windMph = toMph(data.wind.speed.value);
  const humidity = `${data.relativeHumidity}%`;

  const iconUri = data.weatherCondition.iconBaseUri;
  const isColorIcon = iconUri.toLowerCase().includes("color");

  const ageMs =
    updatedAt && now ? now.getTime() - updatedAt.getTime() : null;
  const isStale = ageMs !== null && ageMs > STALE_MS;
  const ageLabel =
    ageMs === null
      ? null
      : ageMs < 60 * 1000
      ? "just now"
      : `${Math.floor(ageMs / 60000)} min ago`;

  const dayLabel = (d: ForecastDay, i: number) => {
    if (i === 0) return "Today";
    const dt = new Date(
      d.displayDate.year,
      d.displayDate.month - 1,
      d.displayDate.day
    );
    return dt.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <Card className="bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 text-white w-full max-w-[95%] mx-auto p-4">
      <CardContent className="flex flex-col items-center p-1">
        <h3 className="text-lg font-semibold text-center">Decatur, Illinois</h3>

        {/* CURRENT CONDITIONS — one compact row */}
        <div className="flex items-center justify-center gap-4 mt-1">
          <img
            src={`${iconUri}.svg`}
            alt={desc}
            style={{
              width: 52,
              height: 52,
              filter: isColorIcon ? "none" : "brightness(1.2)",
            }}
          />
          <div className="flex flex-col items-start leading-tight">
            <p className="text-4xl font-bold">{tempF}°F</p>
            <p className="text-xs text-neutral-400 font-semibold">
              Feels like {feelsF}°F
            </p>
          </div>
          <div className="flex flex-col items-start text-xs text-neutral-300 border-l border-neutral-700 pl-4 leading-relaxed">
            <span className="italic text-neutral-300">{desc}</span>
            <span>
              <span className="text-neutral-500">Wind</span> {windMph} mph
            </span>
            <span>
              <span className="text-neutral-500">Humidity</span> {humidity}
            </span>
          </div>
        </div>

        {/* 5-DAY OUTLOOK */}
        {days.length > 0 && (
          <div className="w-full border-t border-neutral-700 mt-3 pt-3">
            <div className="grid grid-cols-5 gap-1">
              {days.map((d, i) => {
                const hi = asF(d.maxTemperature);
                const lo = asF(d.minTemperature);
                const cond = d.daytimeForecast?.weatherCondition;
                const pop = d.daytimeForecast?.precipitation?.probability?.percent;
                return (
                  <div
                    key={`${d.displayDate.month}-${d.displayDate.day}`}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <span
                      className={`text-xs font-semibold ${
                        i === 0 ? "text-white" : "text-neutral-400"
                      }`}
                    >
                      {dayLabel(d, i)}
                    </span>
                    {cond && (
                      <img
                        src={`${cond.iconBaseUri}.svg`}
                        alt={cond.description.text}
                        style={{ width: 32, height: 32 }}
                      />
                    )}
                    <span className="text-sm font-bold leading-none">
                      {hi !== null ? `${hi.toFixed(0)}°` : "--"}
                    </span>
                    <span className="text-xs text-neutral-500 leading-none">
                      {lo !== null ? `${lo.toFixed(0)}°` : "--"}
                    </span>
                    <span className="text-[10px] text-sky-400 h-3">
                      {typeof pop === "number" && pop > 0 ? `${pop}%` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {ageLabel && (
          <p
            className={`text-xs pt-2 ${
              isStale ? "text-amber-400" : "text-neutral-500"
            }`}
          >
            {isStale ? `Stale — last updated ${ageLabel}` : `Updated ${ageLabel}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;

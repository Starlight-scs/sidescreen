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

// Lobby screens stay open for days without a reload, so the card must refresh
// itself. 10 min keeps us far inside the Google Weather API free quota.
const REFRESH_MS = 10 * 60 * 1000;
// If the newest successful reading gets older than this, say so on screen
// rather than silently presenting stale weather as current.
const STALE_MS = 35 * 60 * 1000;

const WeatherCard: React.FC = () => {
  const [data, setData] = useState<GoogleWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  // Guards against overlapping fetches (interval + visibility can race).
  const inFlight = useRef(false);

  const fetchWeather = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      const lat = 39.8403;
      const lng = -88.9548;

      const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}`;
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

  useEffect(() => {
    setNow(new Date());
    fetchWeather();

    const poll = setInterval(fetchWeather, REFRESH_MS);
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
      clearInterval(tick);
      document.removeEventListener("visibilitychange", catchUp);
      window.removeEventListener("focus", catchUp);
      window.removeEventListener("online", fetchWeather);
    };
  }, [fetchWeather]);

  const toF = (celsius: number) => celsius * (9 / 5) + 32;
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

  const tempF = toF(data.temperature.degrees).toFixed(1);
  const feelsF = toF(data.feelsLikeTemperature.degrees).toFixed(1);
  const desc = data.weatherCondition.description.text;
  const windMph = toMph(data.wind.speed.value);
  const humidity = `${data.relativeHumidity}%`;

  // Detect color support (some Google URIs end in "_color" or include a "color" param)
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

  return (
    <Card className="bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 text-white w-full max-w-[95%] mt-6 mx-auto p-6">
      <CardContent className="flex flex-col items-center space-y-.6 p-1">
        <h3 className="text-lg font-semibold text-center">Decatur, Illinois</h3>

        {/* WEATHER ICON */}
        <div className="flex items-center justify-center">
          <img
            src={`${iconUri}.svg`}
            alt={desc}
            className="transition-transform duration-200 hover:scale-105"
            style={{
              width: 60,
              height: 60,
              // if colored, show it as-is; otherwise apply slight brightness
              filter: isColorIcon ? "none" : "brightness(1.2)",
            }}
          />
        </div>

        <p className="text-4xl font-bold">{tempF}°F</p>
        <p className="text-sm text-neutral-400 font-bold">
          Feels like {feelsF}°F
        </p>
        <p className="italic text-neutral-300">{desc}</p>

        <div className="w-full border-t border-neutral-700 pt-3 text-sm">
          <div className="flex justify-center font-bold">
            <span className="text-neutral-300 p-1">Wind</span>
            <span className="text-neutral-100 p-1">{windMph} mph</span>
          </div>
          <div className="flex justify-center font-bold">
            <span className="text-neutral-300 p-1">Humidity</span>
            <span className="text-neutral-100 p-1">{humidity}</span>
          </div>
        </div>

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

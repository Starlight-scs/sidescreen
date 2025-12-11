import React, { useEffect, useState } from "react";
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

const WeatherCard: React.FC = () => {
  const [data, setData] = useState<GoogleWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toF = (celsius: number) => celsius * (9 / 5) + 32;
  const toMph = (kmh: number) => (kmh / 1.609).toFixed(0);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const lat = 39.8403;
        const lng = -88.9548;

        const url = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${apiKey}&location.latitude=${lat}&location.longitude=${lng}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!res.ok)
          throw new Error(
            json?.error?.message ||
              `Failed with ${res.status}: ${res.statusText}`
          );

        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading)
    return (
      <div className="bg-neutral-800 p-4 rounded-lg shadow-lg border border-neutral-700 text-white w-[280px] text-center">
        Loading weather data...
      </div>
    );

  if (error)
    return (
      <div className="bg-neutral-800 p-4 rounded-lg shadow-lg border border-neutral-700 text-red-400 w-[280px] text-center">
        Error: {error}
      </div>
    );

  if (!data)
    return (
      <div className="bg-neutral-800 p-4 rounded-lg shadow-lg border border-neutral-700 text-neutral-400 w-[280px] text-center">
        No data available
      </div>
    );

  const tempF = toF(data.temperature.degrees).toFixed(1);
  const feelsF = toF(data.feelsLikeTemperature.degrees).toFixed(1);
  const desc = data.weatherCondition.description.text;
  const windMph = toMph(data.wind.speed.value);
  const humidity = `${data.relativeHumidity}%`;

  return (
    <Card className="bg-neutral-800 p-4 rounded-lg shadow-lg border border-neutral-700 text-white w-[280px]">
      <CardContent className="flex flex-col items-center space-y-3 p-0">
        <h3 className="text-lg font-semibold text-center">Decatur, Illinois</h3>

        <img
          src={`${data.weatherCondition.iconBaseUri}.svg`}
          alt={desc}
          style={{
            width: 90,
            height: 60,
            // color version (no grayscale)
            filter: "brightness(1.1)",
          }}
        />

        <p className="text-3xl font-bold">{tempF}°F</p>
        <p className="text-sm text-neutral-400">Feels like {feelsF}°F</p>
        <p className="italic text-neutral-300">{desc}</p>

        <div className="w-full border-t border-neutral-700 pt-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-300">Wind</span>
            <span className="text-neutral-100">{windMph} mph</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-300">Humidity</span>
            <span className="text-neutral-100">{humidity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
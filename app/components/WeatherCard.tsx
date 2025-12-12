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

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-neutral-800 p-2 rounded-lg shadow-lg border border-neutral-700 text-white w-full max-w-[85%] mt-6 mx-auto">
      {children}
    </div>
  );

  if (loading)
    return (
      <Wrapper>
        <div className="text-center text-neutral-300">
          Loading weather data...
        </div>
      </Wrapper>
    );

  if (error)
    return (
      <Wrapper>
        <div className="text-center text-red-400">Error: {error}</div>
      </Wrapper>
    );

  if (!data)
    return (
      <Wrapper>
        <div className="text-center text-neutral-400">No data available</div>
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

  return (
    <Card className="bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 text-white w-full max-w-[85%] mt-6 mx-auto p-3">
      <CardContent className="flex flex-col items-center space-y-.5 p-1">
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
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
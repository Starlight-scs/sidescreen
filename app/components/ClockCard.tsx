'use client';

import { useEffect, useState } from 'react';

export function ClockCard() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null; // <-- avoid rendering server value

  return (
    <div className="flex flex-col items-center justify-center p-4 text-white">
      <p className="text-7xl font-mono tracking-tight">
        {time.toLocaleTimeString()}
      </p>
      <p className="text-lg text-gray-400 uppercase">
        {time.toLocaleDateString()}
      </p>
    </div>
  );
}
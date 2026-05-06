"use client";
import { useState } from "react";

export default function useHandleSearchCity() {
  const [city, setCity] = useState<{
    country?: string;
    is_capital?: boolean;
    latitude?: number;
    longitude?: number;
    name: string;
    population?: number;
    region?: number;
  } | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = `https://api.api-ninjas.com/v1/city?name=${city?.name.trim()}`;

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_CITY_API_KEY || "",
        },
      });
      setLoading(false);
      if (response.ok) {
        const data = await response.json();
        setCity(data[0]);
        setResponseText(`City found: ${data[0].name}, Country: ${data[0].country}`);
      } else {
        setResponseText("City not found.");
      }
    } catch (error) {
      setResponseText(`City not found. ${error}`);
    }
  };

  return { city, setCity, handleSearch, responseText, loading };
}

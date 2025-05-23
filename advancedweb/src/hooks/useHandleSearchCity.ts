"use client";
import { useState } from "react";

export default function useHandleSearchCity() {
  const [city, setCity] = useState("");
  const [responseText, setResponseText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = `https://api.api-ninjas.com/v1/city?name=${city.trim()}`;
    const apiKey = "2uULXu9xcw2JZdx1O+zijw==GXEjkhEesAESQ9wn";

    try {
      setLoading(true);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
        },
      });
      setLoading(false);
      if (response.ok) {
        const data = await response.json();
        setResponseText(`City found: ${data[0].name}, Country: ${data[0].country}`);
      } else {
        setResponseText("City not found.");
      }
    } catch (error) {
      setResponseText("City not found.");
    }
  };

  return { city, setCity, handleSearch, responseText, loading };
}

"use client";
import { useState, useEffect } from "react";

interface Album {
  album_id: string;
  latitude: number;
  longitude: number;
  images: Array<{ url: string }>;
  [key: string]: unknown;
}

export default function useHandlePublicMap() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const res = await fetch("/api/public_map", { method: "GET" });
        if (!res.ok) return;
        const data = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error("Error fetching public albums:", err);
      }
    };

    fetchPublic();
  }, []);

  return { albums };
}

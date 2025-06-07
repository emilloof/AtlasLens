"use client";
import { useState, useEffect } from "react";

export default function useHandleMap() {
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      // 1. Get the user id
      const resMe = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      });
      if (!resMe.ok) return;
      const dataMe = await resMe.json();
      const userId = dataMe.user.user_id;

      console.log("User ID:", userId);
      // 2. Fetch albums for this user
      const resAlbums = await fetch("/api/mymap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }), // <-- send userId, not me
      });
      if (resAlbums.ok) {
        const dataAlbums = await resAlbums.json();
        setAlbums(dataAlbums);
      }
    };
    fetchAll();
  }, []);

  return { albums };
}

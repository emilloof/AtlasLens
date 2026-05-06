"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

import AlbumPreview from "./albumPreview";
import { authService } from "@/services/authService";

// Fix: Markers don't show up without this in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const greenPin = L.icon({
  iconUrl: "/green_pin.png",
  iconSize: [40, 40],
});
const redPin = L.icon({
  iconUrl: "/red_pin.png",
  iconSize: [40, 40],
});

interface AlbumData {
  album_id: string;
  latitude: number;
  longitude: number;
  images: Array<{ url: string }>;
}

export default function LeafletMap({ albums }: { albums: AlbumData[] }) {
  const [position, setPosition] = useState<[number, number] | null>([58.4059049, 15.5992799]);
  const [ownershipMap, setOwnershipMap] = useState<Record<string, boolean>>({});

  const worldBounds: [[number, number], [number, number]] = [
    [-90, -180],
    [90, 180],
  ];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    }
  }, []);
  useEffect(() => {
    const fetchOwnership = async () => {
      const newMap: Record<string, boolean> = {};

      for (const album of albums) {
        try {
          const res = await authService.checkIsMyAlbum(album.album_id);
          newMap[album.album_id] = res.data?.isOwner ?? false;
        } catch (err) {
          console.error(`Error checking ownership for album ${album.album_id}`, err);
        }
      }

      setOwnershipMap(newMap);
    };

    fetchOwnership();
  }, [albums]);
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={position ?? [0, 0]}
        zoom={6}
        scrollWheelZoom={true}
        minZoom={2.3}
        style={{ height: "100vh", width: "100%", position: "static" }}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
        />
        {albums.map((album) => {
          const isOwner = ownershipMap[album.album_id];
          if (isOwner === undefined) return null;
          const icon = isOwner ? greenPin : redPin;

          return (
            <Marker key={album.album_id} position={[album.latitude, album.longitude]} icon={icon}>
              <Popup className="map-album">
                <div>
                  <AlbumPreview
                    images={[
                      album.images[0]?.url || "/placeholder.png",
                      album.images[1]?.url || "/placeholder.png",
                      album.images[2]?.url || "/placeholder.png",
                      album.images[3]?.url || "/placeholder.png",
                      album.images[4]?.url || "/placeholder.png",
                    ]}
                    width={150}
                    height={100}
                    interact={true}
                    albumID={album.album_id}
                  />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

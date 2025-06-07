"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

import AlbumPreview from "./albumPreview";

// Fix: Markers don't show up without this in Next.js
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const smileyIcon = L.icon({
  iconUrl: "/icons8-red-dot-48.png",

  iconSize: [40, 40],
});

export default function LeafletMap({ albums }: { albums: any[] }) {
  console.log("Albums in LeafletMap:", albums);
  const [position, setPosition] = useState<[number, number] | null>([58.4059049, 15.5992799]);

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
        {albums.map(
          (album) => (
            console.log("Rendering album marker:", album),
            (
              <Marker key={album.album_id} position={[album.latitude, album.longitude]} icon={smileyIcon}>
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
            )
          )
        )}
      </MapContainer>
    </div>
  );
}

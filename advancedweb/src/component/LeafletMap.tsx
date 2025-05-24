"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import exampleImage from "../public/MyPhoto.jpg";

import AlbumPreview from "./albumPreview";

// Fix: Markers don't show up without this in Next.js
delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const smileyIcon = L.icon({
  iconUrl:
    "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlMThfYV9jdXRlXzNkX29mX2FfbGlrZV9lbW9qaV9pc29sYXRlZF9vbl9hX3doaXRlX18wMTI4NDc0Ny1hNTc3LTRmYmEtYjZjNS02YjBhMzc3MmEzOWIucG5n.png",

  iconSize: [80, 80],
  shadowSize: [50, 64],
  iconAnchor: [22, 94],
  shadowAnchor: [4, 62],
  popupAnchor: [-3, -76],
});

export default function LeafletMap() {
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
    <MapContainer
      center={position ?? [0, 0]}
      zoom={6}
      scrollWheelZoom={true}
      minZoom={2.3}
      style={{ height: "100vh", width: "100%" }}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
      />
      {position && <Marker position={position}></Marker>}
      <Marker position={[37.7562, -122.443]} icon={smileyIcon}>
        <Popup className="map-album">
          <div>
            <AlbumPreview
              images={[exampleImage.src, exampleImage.src, exampleImage.src]}
              width={150}
              height={100}
              interact={true}
            />
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

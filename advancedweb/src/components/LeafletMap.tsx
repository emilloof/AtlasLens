'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import exampleImage from '../public/MyPhoto.jpg'
import Image from 'next/image'



// Fix: Markers don't show up without this in Next.js
delete (L.Icon.Default as any).prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})


var smileyIcon = L.icon({
  iconUrl: 'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAxL3Jhd3BpeGVsb2ZmaWNlMThfYV9jdXRlXzNkX29mX2FfbGlrZV9lbW9qaV9pc29sYXRlZF9vbl9hX3doaXRlX18wMTI4NDc0Ny1hNTc3LTRmYmEtYjZjNS02YjBhMzc3MmEzOWIucG5n.png',

  iconSize:     [80, 80], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});



export default function LeafletMap() {
  const [position, setPosition] = useState<[number, number] | null>([58.4059049, 15.5992799])

   // Define the bounds for the entire world
   const worldBounds: [[number, number], [number, number]] = [
    [-90, -180], // Southwest corner (latitude, longitude)
    [90, 180],   // Northeast corner (latitude, longitude)
  ];

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          console.log('Got location:', coords)
          setPosition(coords)
          
        },
        (error) => {
          console.error('Error getting location:', error.message)
        }
      )
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
  }, [])
  
  return (
    <MapContainer
      center={position ?? [0, 0]}
      zoom={6}
      scrollWheelZoom={true}
      minZoom={2.3} // prevent zooming too far out
      style={{ height: '100vh', width: '100%' }}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      worldCopyJump={false} // prevents repeating the map
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.carto.com/">CARTO</a>'
        //noWrap={true}  prevents repeating the map
      />
      {position && <Marker position={position}></Marker>}
      {/*  <Marker position={[37.7562, -122.443]} icon={smileyIcon}>
          <Popup>
            <div>
              <Image src={exampleImage} alt="image" width={100} height={100}/>
            </div>
          </Popup> 
      </Marker> */}
    </MapContainer>
  )
}
 
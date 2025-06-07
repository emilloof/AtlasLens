'use client'

import dynamic from 'next/dynamic'
import useHandleMap from '@/hooks/useHandleMap'

const MapComponent = dynamic(() => import('@/component/LeafletMap'), { ssr: false })

export default function Page() {
  const {albums} = useHandleMap()
  console.log("Fetched albums:", albums)  
  return <MapComponent albums={albums} />
}
'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/LeafletMap'), { ssr: false })

export default function Page() {
  return <MapComponent />
}

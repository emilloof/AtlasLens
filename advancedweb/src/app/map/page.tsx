'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/component/LeafletMap'), { ssr: false })

export default function Page() {
  return <MapComponent />
}
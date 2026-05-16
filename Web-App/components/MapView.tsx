'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface EventData {
  id: string
  geolocation: {
    latitude: number
    longitude: number
  }
  macAddress: string
  category: 'pothole' | 'crack' | 'debris' | 'flooding'
  priority: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
}

const categoryColors: Record<string, string> = {
  pothole: '#FF6B6B',
  crack: '#FFA500',
  debris: '#FFD700',
  flooding: '#4ECDC4',
}

const prioritySize: Record<string, number> = {
  low: 8,
  medium: 12,
  high: 16,
  critical: 20,
}

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [events, setEvents] = useState<EventData[]>([])

  // Load JSON data
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('/data/events.json')
        const data: EventData[] = await response.json()
        setEvents(data)
      } catch (error) {
        console.error('Failed to load events:', error)
      }
    }
    loadEvents()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.5, 40],
      zoom: 10,
    })

    return () => {
      if (map.current) map.current.remove()
    }
  }, [])

  // Add event markers
  useEffect(() => {
    if (!map.current || events.length === 0) return

    events.forEach((event) => {
      const el = document.createElement('div')
      const size = prioritySize[event.priority]
      const color = categoryColors[event.category]

      el.style.width = `${size}px`
      el.style.height = `${size}px`
      el.style.backgroundColor = color
      el.style.borderRadius = '50%'
      el.style.cursor = 'pointer'
      el.style.border = '2px solid rgba(255,255,255,0.3)'
      el.style.boxShadow = `0 0 ${size}px ${color}80`
      el.style.transition = 'all 0.2s'

      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = `0 0 ${size + 4}px ${color}`
        el.style.transform = 'scale(1.2)'
      })

      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = `0 0 ${size}px ${color}80`
        el.style.transform = 'scale(1)'
      })

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="text-sm space-y-2">
          <div><strong>Category:</strong> ${event.category}</div>
          <div><strong>Priority:</strong> <span class="capitalize">${event.priority}</span></div>
          <div><strong>MAC:</strong> ${event.macAddress}</div>
          <div><strong>Location:</strong> ${event.geolocation.latitude.toFixed(4)}, ${event.geolocation.longitude.toFixed(4)}</div>
          <div><strong>Time:</strong> ${new Date(event.timestamp).toLocaleString()}</div>
        </div>
      `)

      new mapboxgl.Marker({ element: el })
        .setLngLat([event.geolocation.longitude, event.geolocation.latitude])
        .setPopup(popup)
        .addTo(map.current)
    })
  }, [events])

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute top-3 left-3 w-40 p-3 bg-black/80 backdrop-blur border border-white/10 rounded z-20">
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">
          Legend
        </div>

        <div className="space-y-2">
          <div className="text-xs">
            <div className="font-semibold text-gray-300 mb-2">Category</div>
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center gap-2 mb-1.5">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-gray-400 capitalize">{category}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-2 mt-2">
            <div className="font-semibold text-gray-300 mb-2">Priority</div>
            {Object.entries(prioritySize).map(([priority, size]) => (
              <div key={priority} className="flex items-center gap-2 mb-1.5">
                <div
                  className="rounded-full flex-shrink-0 bg-blue-400"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                />
                <span className="text-gray-400 capitalize">{priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

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
  category:
    | 'pothole'
    | 'crack'
    | 'debris'
    | 'flooding'

  priority:
    | 'very-low'
    | 'low'
    | 'medium'
    | 'high'
    | 'critical'

  timestamp: string
}

// CATEGORY COLORS (filter buttons only)
const categoryColors: Record<string, string> = {
  pothole: '#FF6B6B',
  crack: '#FFA500',
  debris: '#FFD700',
  flooding: '#4ECDC4',
}

// PRIORITY COLORS (actual map markers)
const priorityColors: Record<string, string> = {
  'very-low': '#22c55e', // green
  low: '#84cc16', // lime
  medium: '#eab308', // yellow
  high: '#f97316', // orange
  critical: '#ef4444', // red
}

// Split
const SPLIT_CENTER: [number, number] = [16.4402, 43.5081]

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  const [events, setEvents] = useState<EventData[]>([])
  const [selectedCategory, setSelectedCategory] =
    useState<string>('all')

  // Load JSON
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('/data/events.json')

        const data: EventData[] =
          await response.json()

        setEvents(data)
      } catch (error) {
        console.error(
          'Failed to load events:',
          error
        )
      }
    }

    loadEvents()
  }, [])

  // Init map
  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: SPLIT_CENTER,
      zoom: 13.1,
      antialias: true,
    })

    // FIXED ZOOM CONTROLS
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: false,
      showCompass: false,
      showZoom: true,
    })

    map.current.addControl(nav, 'bottom-right')

    return () => {
      markersRef.current.forEach((marker) =>
        marker.remove()
      )

      markersRef.current = []

      map.current?.remove()
      map.current = null
    }
  }, [])

  // Render markers
  useEffect(() => {
    if (!map.current) return
    if (events.length === 0) return

    // Remove old markers
    markersRef.current.forEach((marker) =>
      marker.remove()
    )

    markersRef.current = []

    // Filter
    const filteredEvents =
      selectedCategory === 'all'
        ? events
        : events.filter(
            (event) =>
              event.category === selectedCategory
          )

    filteredEvents.forEach((event) => {
      const wrapper = document.createElement('div')
      const dot = document.createElement('div')

      const color =
        priorityColors[event.priority]

      wrapper.style.cursor = 'pointer'
      wrapper.style.display = 'flex'
      wrapper.style.alignItems = 'center'
      wrapper.style.justifyContent = 'center'

      // FIXED SIZE
      dot.style.width = `14px`
      dot.style.height = `14px`

      dot.style.backgroundColor = color
      dot.style.borderRadius = '999px'

      dot.style.border =
        '2px solid rgba(255,255,255,0.35)'

      dot.style.boxShadow = `0 0 18px ${color}90`

      dot.style.transition = 'all 0.2s ease'

      wrapper.appendChild(dot)

      // Hover
      wrapper.addEventListener('mouseenter', () => {
        dot.style.boxShadow = `0 0 28px ${color}`

        dot.style.border =
          '2px solid rgba(255,255,255,0.8)'
      })

      wrapper.addEventListener('mouseleave', () => {
        dot.style.boxShadow = `0 0 18px ${color}90`

        dot.style.border =
          '2px solid rgba(255,255,255,0.35)'
      })

      // Popup
      const popup = new mapboxgl.Popup({
        offset: 18,
        closeButton: true,
      }).setHTML(`
        <div style="
          min-width:240px;
          background:#111;
          color:white;
          font-family:Inter,sans-serif;
          padding:2px;
        ">
          <div style="
            font-size:14px;
            font-weight:700;
            margin-bottom:10px;
            text-transform:capitalize;
            color:${color};
          ">
            ${event.category}
          </div>

          <div style="
            font-size:12px;
            line-height:1.7;
          ">
            <div>
              <strong>ID:</strong>
              ${event.id}
            </div>

            <div>
              <strong>Category:</strong>
              ${event.category}
            </div>

            <div>
              <strong>Priority:</strong>
              ${event.priority}
            </div>

            <div>
              <strong>MAC:</strong>
              ${event.macAddress}
            </div>

            <div>
              <strong>Latitude:</strong>
              ${event.geolocation.latitude}
            </div>

            <div>
              <strong>Longitude:</strong>
              ${event.geolocation.longitude}
            </div>

            <div>
              <strong>Timestamp:</strong>
              ${new Date(
                event.timestamp
              ).toLocaleString()}
            </div>
          </div>
        </div>
      `)

      const marker = new mapboxgl.Marker({
        element: wrapper,
        anchor: 'center',
      })
        .setLngLat([
          event.geolocation.longitude,
          event.geolocation.latitude,
        ])
        .setPopup(popup)
        .addTo(map.current!)

      markersRef.current.push(marker)
    })
  }, [events, selectedCategory])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* GLOBAL STYLES */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          background: #111 !important;
          color: white !important;
          border: 1px solid
            rgba(255, 255, 255, 0.08) !important;
          border-radius: 14px !important;
          box-shadow: 0 10px 40px
            rgba(0, 0, 0, 0.45) !important;
          padding: 12px !important;
        }

        .mapboxgl-popup-tip {
          border-top-color: #111 !important;
          border-bottom-color: #111 !important;
        }

        .mapboxgl-popup-close-button {
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          padding: 6px 8px;
        }

        .mapboxgl-popup-close-button:hover {
          background: transparent !important;
          color: white;
        }

        /* FIX MAPBOX CONTROLS */
        .mapboxgl-ctrl-group {
          background: rgba(10, 10, 10, 0.9) !important;
          border: 1px solid
            rgba(255, 255, 255, 0.08) !important;
          overflow: hidden;
          border-radius: 12px !important;
          backdrop-filter: blur(10px);
        }

        .mapboxgl-ctrl-group button {
          background: transparent !important;
        }

        .mapboxgl-ctrl-group button span {
          filter: invert(1);
        }

        .mapboxgl-ctrl-bottom-right {
          bottom: 70px;
          right: 12px;
        }
      `}</style>

      {/* MAP */}
      <div
        ref={mapContainer}
        className="h-full w-full"
      />

      {/* OVERLAY */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_35%)]" />

      {/* Top bar removed per request */}

      {/* FILTERS (mobile-friendly: horizontal scroll + compact buttons) */}
      <div className="absolute top-4 right-3 z-20 flex gap-2 whitespace-nowrap overflow-x-auto pr-3 sm:flex-wrap sm:overflow-visible sm:pr-0">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`rounded border px-2 sm:px-3 py-1 text-[10px] sm:text-xs uppercase tracking-wider transition ${
            selectedCategory === 'all'
              ? 'border-orange-500 bg-orange-500 text-black'
              : 'border-white/10 bg-black/70 text-gray-400'
          }`}
        >
          All
        </button>

        {Object.keys(categoryColors).map(
          (category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`rounded border px-2 sm:px-3 py-1 text-[10px] sm:text-xs uppercase tracking-wider transition ${
                selectedCategory === category
                  ? 'border-orange-500 bg-orange-500 text-black'
                  : 'border-white/10 bg-black/70 text-gray-400'
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* LEGEND (hidden on small screens) */}
      <div className="absolute top-4 left-3 z-20 hidden sm:block w-52 rounded border border-white/10 bg-black/80 p-3 backdrop-blur-md">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          Priority Levels
        </div>

        <div className="space-y-2">
          {Object.entries(priorityColors).map(
            ([priority, color]) => (
              <div
                key={priority}
                className="flex items-center gap-2"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}`,
                  }}
                />

                <span className="text-xs capitalize text-gray-300">
                  {priority}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* STATUS BAR (hidden on small screens) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 hidden sm:flex h-12 items-center justify-center border-t border-white/10 bg-black/70 text-[10px] uppercase tracking-[0.25em] text-gray-500 backdrop-blur-md">
        {selectedCategory === 'all'
          ? `${events.length} active reports loaded`
          : `${
              events.filter(
                (e) =>
                  e.category === selectedCategory
              ).length
            } ${selectedCategory} reports`}
      </div>
    </div>
  )
}
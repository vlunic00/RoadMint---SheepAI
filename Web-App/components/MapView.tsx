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

// ============================================
// CATEGORY COLORS
// ============================================

const categoryColors: Record<string, string> = {
  pothole: '#FF6B6B',
  crack: '#FFA500',
  debris: '#FFD700',
  flooding: '#4ECDC4',
}

// ============================================
// PRIORITY COLORS
// ============================================

const priorityColors: Record<string, string> = {
  'very-low': '#22c55e',
  low: '#84cc16',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
}

// ============================================
// MAP PRESETS
// ============================================

const MAP_VIEWS = {
  FLAT: {
    style: 'mapbox://styles/mapbox/dark-v11',
    pitch: 0,
    bearing: 0,
    fog: false,
    buildings: false,
    enhancedRoads: false,
    grid: false,
  },

  CINEMATIC: {
    style:
      'mapbox://styles/mapbox/navigation-night-v1',

    pitch: 45,
    bearing: -17,

    fog: true,
    buildings: true,
    enhancedRoads: true,
    grid: true,
  },
}

// ============================================
// CHANGE THIS ONLY
// ============================================

// const ACTIVE_VIEW = MAP_VIEWS.FLAT
const ACTIVE_VIEW = MAP_VIEWS.CINEMATIC

// ============================================
// SPLIT
// ============================================

const SPLIT_CENTER: [number, number] = [
  16.4402,
  43.5081,
]

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null)

  const map = useRef<mapboxgl.Map | null>(null)

  const markersRef = useRef<mapboxgl.Marker[]>(
    []
  )

  const [events, setEvents] = useState<
    EventData[]
  >([])

  const [selectedCategory, setSelectedCategory] =
    useState<string>('all')

  // ============================================
  // LOAD EVENTS
  // ============================================

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(
          '/data/events.json'
        )

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

  // ============================================
  // INIT MAP
  // ============================================

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    map.current = new mapboxgl.Map({
      container: mapContainer.current,

      style: ACTIVE_VIEW.style,

      center: SPLIT_CENTER,
      zoom: 13.1,

      pitch: ACTIVE_VIEW.pitch,
      bearing: ACTIVE_VIEW.bearing,

      antialias: true,
    })

    // ============================================
    // CONTROLS
    // ============================================

    const nav = new mapboxgl.NavigationControl({
      visualizePitch: false,
      showCompass: false,
      showZoom: true,
    })

    map.current.addControl(nav, 'bottom-right')

    // ============================================
    // MAP STYLE ENHANCEMENTS
    // ============================================

    map.current.on('style.load', () => {
      if (!map.current) return

      const layers =
        map.current.getStyle().layers || []

      // ============================================
      // ENHANCED ROADS
      // ============================================

      if (ACTIVE_VIEW.enhancedRoads) {
        layers.forEach((layer) => {
          if (
            layer.type === 'line' &&
            layer.id.includes('road')
          ) {
            try {
              map.current?.setPaintProperty(
                layer.id,
                'line-color',
                '#5f5f5f'
              )

              map.current?.setPaintProperty(
                layer.id,
                'line-opacity',
                0.55
              )
            } catch {}
          }
        })
      }

      // ============================================
      // 3D BUILDINGS
      // ============================================

      if (ACTIVE_VIEW.buildings) {
        const labelLayerId = layers.find(
          (layer) =>
            layer.type === 'symbol' &&
            layer.layout &&
            (layer.layout as any)['text-field']
        )?.id

        if (
          labelLayerId &&
          !map.current.getLayer(
            '3d-buildings'
          )
        ) {
          map.current.addLayer(
            {
              id: '3d-buildings',
              source: 'composite',
              'source-layer': 'building',
              filter: [
                '==',
                'extrude',
                'true',
              ],

              type: 'fill-extrusion',

              minzoom: 14,

              paint: {
                'fill-extrusion-color':
                  '#1a1a1a',

                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15,
                  ['get', 'height'],
                ],

                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  14,
                  0,
                  15,
                  ['get', 'min_height'],
                ],

                'fill-extrusion-opacity':
                  0.55,
              },
            },
            labelLayerId
          )
        }
      }

      // ============================================
      // FOG
      // ============================================

      if (ACTIVE_VIEW.fog) {
        map.current.setFog({
          color: 'rgb(15,15,20)',

          'high-color':
            'rgb(30,30,40)',

          'horizon-blend': 0.04,

          'space-color':
            'rgb(5,5,8)',

          'star-intensity': 0.15,
        })
      }
    })

    return () => {
      markersRef.current.forEach((marker) =>
        marker.remove()
      )

      markersRef.current = []

      map.current?.remove()
      map.current = null
    }
  }, [])

  // ============================================
  // RENDER MARKERS
  // ============================================

  useEffect(() => {
    if (!map.current) return
    if (events.length === 0) return

    // REMOVE OLD MARKERS

    markersRef.current.forEach((marker) =>
      marker.remove()
    )

    markersRef.current = []

    // FILTER EVENTS

    const filteredEvents =
      selectedCategory === 'all'
        ? events
        : events.filter(
            (event) =>
              event.category ===
              selectedCategory
          )

    filteredEvents.forEach((event) => {
      const wrapper =
        document.createElement('div')

      const dot =
        document.createElement('div')

      const color =
        priorityColors[event.priority]

      wrapper.style.cursor = 'pointer'

      wrapper.style.display = 'flex'

      wrapper.style.alignItems = 'center'

      wrapper.style.justifyContent = 'center'

      // ============================================
      // MARKER STYLE
      // ============================================

      dot.style.width = `16px`
      dot.style.height = `16px`

      dot.style.backgroundColor = color

      dot.style.borderRadius = '999px'

      dot.style.border =
        '2px solid rgba(255,255,255,0.35)'

      dot.style.boxShadow = `
        0 0 12px ${color},
        0 0 24px ${color}80
      `

      dot.style.transition =
        'all 0.2s ease'

      wrapper.appendChild(dot)

      // ============================================
      // HOVER
      // ============================================

      wrapper.addEventListener(
        'mouseenter',
        () => {
          dot.style.boxShadow = `
            0 0 18px ${color},
            0 0 36px ${color}
          `

          dot.style.border =
            '2px solid rgba(255,255,255,0.8)'
        }
      )

      wrapper.addEventListener(
        'mouseleave',
        () => {
          dot.style.boxShadow = `
            0 0 12px ${color},
            0 0 24px ${color}80
          `

          dot.style.border =
            '2px solid rgba(255,255,255,0.35)'
        }
      )

      // ============================================
      // POPUP
      // ============================================

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
      {/* ============================================ */}
      {/* GLOBAL STYLES */}
      {/* ============================================ */}

      <style jsx global>{`
        .mapboxgl-popup-content {
          background: #111 !important;
          color: white !important;

          border: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            ) !important;

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
          color: rgba(
            255,
            255,
            255,
            0.6
          );

          font-size: 16px;

          padding: 6px 8px;
        }

        .mapboxgl-popup-close-button:hover {
          background: transparent !important;
          color: white;
        }

        /* CONTROLS */

        .mapboxgl-ctrl-group {
          background: rgba(
            10,
            10,
            10,
            0.9
          ) !important;

          border: 1px solid
            rgba(
              255,
              255,
              255,
              0.08
            ) !important;

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

      {/* ============================================ */}
      {/* MAP */}
      {/* ============================================ */}

      <div
        ref={mapContainer}
        className="h-full w-full"
      />

      {/* ============================================ */}
      {/* GRID OVERLAY */}
      {/* ============================================ */}

      {ACTIVE_VIEW.grid && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_35%)]">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize:
                '40px 40px',
            }}
          />
        </div>
      )}

      {/* ============================================ */}
      {/* FILTERS */}
      {/* ============================================ */}

      <div className="absolute top-4 right-3 z-20 flex gap-2 whitespace-nowrap overflow-x-auto pr-3 sm:flex-wrap sm:overflow-visible sm:pr-0">
        <button
          onClick={() =>
            setSelectedCategory('all')
          }
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

      {/* ============================================ */}
      {/* LEGEND */}
      {/* ============================================ */}

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
                    backgroundColor:
                      color,

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

      {/* ============================================ */}
      {/* STATUS */}
      {/* ============================================ */}

      <div className="absolute bottom-0 left-0 right-0 z-20 hidden sm:flex h-12 items-center justify-center border-t border-white/10 bg-black/70 text-[10px] uppercase tracking-[0.25em] text-gray-500 backdrop-blur-md">
        {selectedCategory === 'all'
          ? `${events.length} active reports loaded`
          : `${
              events.filter(
                (e) =>
                  e.category ===
                  selectedCategory
              ).length
            } ${selectedCategory} reports`}
      </div>
    </div>
  )
}
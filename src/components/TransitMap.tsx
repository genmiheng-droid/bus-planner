import React, { useState } from 'react';
import { BusStop, PlannedRoute } from '../types';

interface TransitMapProps {
  stops: BusStop[];
  selectedStop: BusStop;
  onSelectStop: (stop: BusStop) => void;
  plannedRoute?: PlannedRoute | null;
  showPlannedRoute?: boolean;
}

export const TransitMap: React.FC<TransitMapProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  plannedRoute = null,
  showPlannedRoute = false,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Dynamic route coordinates if planned
  const hasRoute = Boolean(plannedRoute || showPlannedRoute);
  const originCoords = plannedRoute?.originCoords || { x: 490, y: 435 };
  const destCoords = plannedRoute?.destCoords || { x: 830, y: 370 };
  const originName = plannedRoute?.originName || 'Current Address';
  const destName = plannedRoute?.destName || 'Destination';

  // Quadratic curve between origin and destination
  const midX = (originCoords.x + destCoords.x) / 2;
  const dx = destCoords.x - originCoords.x;
  const midY = (originCoords.y + destCoords.y) / 2 - Math.min(45, Math.max(15, Math.abs(dx) * 0.08));
  const dynamicRouteD = `M ${originCoords.x},${originCoords.y} Q ${midX},${midY} ${destCoords.x},${destCoords.y}`;

  return (
    <div className="relative min-h-[380px] sm:min-h-[460px] bg-[#071120] map-grid-pattern overflow-hidden flex items-center justify-center select-none" data-purpose="singapore-map-view">
      {/* Map Controls (+/- zoom & reset) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-night-900/90 border border-night-700 rounded-lg p-1 shadow-lg">
        <button
          aria-label="Zoom in"
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-night-800 rounded font-bold transition text-base cursor-pointer"
        >
          +
        </button>
        <div className="h-px bg-night-700 my-0.5" />
        <button
          aria-label="Zoom out"
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-night-800 rounded font-bold transition text-base cursor-pointer"
        >
          −
        </button>
        {zoomLevel !== 1 && (
          <>
            <div className="h-px bg-night-700 my-0.5" />
            <button
              aria-label="Reset zoom"
              type="button"
              onClick={handleResetZoom}
              className="w-8 h-6 flex items-center justify-center text-slate-400 hover:bg-night-800 rounded font-xs text-[10px] transition cursor-pointer"
            >
              1:1
            </button>
          </>
        )}
      </div>

      {/* SVG Vector Representation of Singapore Transit Arterials & Labels */}
      <div
        className="w-full h-full absolute inset-0 transition-transform duration-300 ease-out origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 900 500"
          className="w-full h-full absolute inset-0"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Restricted zones striped area hint */}
          <path
            d="M 360,160 L 480,180 L 460,260 L 340,240 Z"
            fill="rgba(220, 38, 38, 0.08)"
            stroke="rgba(220, 38, 38, 0.25)"
            strokeDasharray="4,4"
          />
          <text x="375" y="210" fill="#f87171" fontSize="10" fontWeight="700" letterSpacing="1">
            RESTRICTED AREA
          </text>

          <path
            d="M 420,380 L 520,385 L 500,430 L 410,420 Z"
            fill="rgba(220, 38, 38, 0.08)"
            stroke="rgba(220, 38, 38, 0.25)"
            strokeDasharray="4,4"
          />
          <text x="435" y="405" fill="#f87171" fontSize="9" fontWeight="700">
            RESTRICTED
          </text>

          {/* Coastline / Geographic contours subtle lines */}
          <path d="M 50,380 Q 200,430 380,480 T 700,440 T 880,360" stroke="#172e4c" strokeWidth="2" />
          <path d="M 720,240 Q 820,200 870,250" stroke="#172e4c" strokeWidth="1.5" />
          <path d="M 100,280 Q 180,240 260,270" stroke="#172e4c" strokeWidth="1.5" />

          {/* Major Singapore Transit Arterial Corridors (from screenshot) */}
          {/* PIE / AYE Expressway / Bus Highway Network (Cyan & Orange arterials) */}
          <path
            d="M 120,440 C 260,420 320,380 430,340 S 620,360 840,360"
            stroke="#0284c7"
            strokeWidth="5"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <path
            d="M 280,300 C 350,360 490,460 560,480"
            stroke="#009645"
            strokeWidth="4.5"
            opacity="0.9"
          />
          {/* Orange Arterial */}
          <path
            d="M 330,160 C 340,270 420,330 550,370"
            stroke="#ea580c"
            strokeWidth="3"
            opacity="0.9"
          />
          {/* Downtown / Express Arterial */}
          <path
            d="M 390,160 C 470,240 540,230 620,210 T 820,310"
            stroke="#0284c7"
            strokeWidth="4.5"
            opacity="0.85"
          />
          {/* TEL Spine Brown */}
          <path d="M 550,160 L 550,490" stroke="#9d5b25" strokeWidth="3.5" opacity="0.8" />
          {/* Downtown corridor Blue */}
          <path
            d="M 480,240 C 580,260 670,300 780,420"
            stroke="#005ec4"
            strokeWidth="4"
            opacity="0.85"
          />

          {/* Planned Commute Route Animated Trail (from Current Address to Destination Address) */}
          {hasRoute && (
            <g id="dynamic-commute-telemetry-route">
              {/* Outer glow aura */}
              <path
                d={dynamicRouteD}
                stroke="#38bdf8"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.25"
                className="animate-pulse"
              />
              {/* Animated Dashed Pulse Line */}
              <path
                d={dynamicRouteD}
                stroke="#0284c7"
                strokeWidth="4.5"
                strokeDasharray="8,6"
                strokeLinecap="round"
                className="animate-pulse"
              />
              <path
                d={dynamicRouteD}
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Dynamic Origin Marker (Current Address) */}
              <g transform={`translate(${originCoords.x}, ${originCoords.y})`}>
                <circle r="18" fill="rgba(16, 185, 129, 0.35)" className="animate-ping" />
                <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                <rect
                  x="-75"
                  y="-34"
                  width="150"
                  height="22"
                  rx="5"
                  fill="#022c22"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="-20"
                  fill="#6ee7b7"
                  fontSize="9.5"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  📍 {originName.length > 20 ? originName.slice(0, 18) + '...' : originName}
                </text>
              </g>

              {/* Dynamic Destination Marker (Destination Address) */}
              <g transform={`translate(${destCoords.x}, ${destCoords.y})`}>
                <circle r="18" fill="rgba(244, 63, 94, 0.35)" className="animate-ping" />
                <circle r="8" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
                <rect
                  x="-75"
                  y="-34"
                  width="150"
                  height="22"
                  rx="5"
                  fill="#4c0519"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="-20"
                  fill="#fda4af"
                  fontSize="9.5"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  🏁 {destName.length > 20 ? destName.slice(0, 18) + '...' : destName}
                </text>
              </g>
            </g>
          )}

          {/* Regional Labeling matching Singapore geographic layout */}
          <g fill="#cbd5e1" fontSize="11" fontWeight="700" letterSpacing="0.5" textAnchor="middle">
            <text x="235" y="425">JURONG WEST</text>
            <text x="320" y="435">JURONG EAST</text>
            <text x="340" y="302">BUKIT BATOK</text>
            <text x="340" y="222">CHOA CHU KANG</text>
            <text x="382" y="258">BUKIT PANJANG</text>
            <text x="440" y="478">BUKIT TIMAH</text>
            <text x="548" y="272">ANG MO KIO</text>
            <text x="570" y="342">BISHAN</text>
            <text x="568" y="380">TOA PAYOH</text>
            <text x="635" y="172">SELETAR</text>
            <text x="688" y="200">PUNGGOL</text>
            <text x="675" y="272">SENGKANG</text>
            <text x="650" y="325">HOUGANG</text>
            <text x="615" y="365">SERANGOON</text>
            <text x="710" y="415">PAYA LEBAR</text>
            <text x="758" y="482">BEDOK</text>
            <text x="790" y="390">TAMPINES</text>
            <text x="785" y="315">PASIR RIS</text>
            <text x="550" y="475">MARINA BAY</text>
            <text x="798" y="220">PULAU KETAM</text>
          </g>

          {/* Real Clickable Stop Markers */}
          {stops.map((stop) => {
            const isSelected = selectedStop.id === stop.id;
            const isStopOrigin = hasRoute && (
              Math.abs(stop.coordinates.x - originCoords.x) < 25 &&
              Math.abs(stop.coordinates.y - originCoords.y) < 25
            );

            return (
              <g
                key={stop.id}
                transform={`translate(${stop.coordinates.x}, ${stop.coordinates.y})`}
                onClick={() => onSelectStop(stop)}
                className="cursor-pointer transition-transform duration-150 hover:scale-110"
              >
                {/* Outer pulsing ring for selected stop */}
                {isSelected && (
                  <circle
                    r="16"
                    fill="rgba(59, 130, 246, 0.35)"
                    className="animate-ping"
                  />
                )}

                {/* Pin Circle */}
                <circle
                  r={isSelected ? '9' : '7'}
                  fill={
                    stop.id === 'bayfront-03511'
                      ? '#3b82f6'
                      : stop.id === 'orchard-09022'
                      ? '#10b981'
                      : stop.id === 'bishan-53009'
                      ? '#f59e0b'
                      : stop.id === 'jewel-changi'
                      ? '#ec4899'
                      : '#38bdf8'
                  }
                  stroke="#ffffff"
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                />

                {/* Text Badge */}
                {stop.id === 'bayfront-03511' && (
                  <>
                    <rect
                      x="12"
                      y="-12"
                      width="105"
                      height="22"
                      rx="4"
                      fill="#0f172a"
                      stroke="#3b82f6"
                      strokeWidth="1"
                    />
                    <text x="18" y="3" fill="#ffffff" fontSize="9.5" fontWeight="700">
                      {isStopOrigin ? '📍 Start (Stop 03511)' : 'Stop 03511 (MBS)'}
                    </text>
                  </>
                )}

                {stop.id === 'orchard-09022' && (
                  <>
                    <rect
                      x="-80"
                      y="-18"
                      width="75"
                      height="18"
                      rx="3"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text x="-74" y="-5" fill="#94a3b8" fontSize="8.5" fontWeight="600">
                      Stop 09022
                    </text>
                  </>
                )}

                {stop.id === 'bishan-53009' && (
                  <>
                    <rect
                      x="10"
                      y="-8"
                      width="80"
                      height="18"
                      rx="3"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text x="14" y="5" fill="#94a3b8" fontSize="8.5" fontWeight="600">
                      Stop 53009
                    </text>
                  </>
                )}

                {stop.id === 'jewel-changi' && (
                  <>
                    <rect
                      x="-105"
                      y="-10"
                      width="100"
                      height="18"
                      rx="3"
                      fill="#0f172a"
                      stroke="#ec4899"
                      strokeWidth="1"
                    />
                    <text x="-98" y="3" fill="#ffffff" fontSize="8.5" fontWeight="700">
                      Jewel Changi Hub
                    </text>
                  </>
                )}

                {stop.id === 'bedok-84009' && (
                  <>
                    <rect
                      x="10"
                      y="-8"
                      width="80"
                      height="18"
                      rx="3"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text x="14" y="5" fill="#94a3b8" fontSize="8.5" fontWeight="600">
                      Stop 84009
                    </text>
                  </>
                )}

                {stop.id === 'jurong-28009' && (
                  <>
                    <rect
                      x="-95"
                      y="-10"
                      width="90"
                      height="18"
                      rx="3"
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text x="-90" y="3" fill="#94a3b8" fontSize="8.5" fontWeight="600">
                      Jurong East Int
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Overlay Tag on Map */}
      <div className="absolute bottom-3 right-3 bg-night-950/85 backdrop-blur-md border border-night-700/80 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 z-10">
        Data: <span className="text-slate-200 font-semibold">LTA DataMall Telemetry</span> • GPS Ready
      </div>
    </div>
  );
};

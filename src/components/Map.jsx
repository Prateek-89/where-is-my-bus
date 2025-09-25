// src/components/Map.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

// Small helper for distances and interpolation on a polyline
function distance(a, b) {
  const dx = a.x - b.x; const dy = a.y - b.y; return Math.hypot(dx, dy);
}
function buildCum(path) { const c=[0]; for (let i=1;i<path.length;i++) c[i]=c[i-1]+distance(path[i-1],path[i]); return c; }
function at(path, cum, d) {
  const total = cum[cum.length-1] || 1;
  let t = ((d % total) + total) % total;
  for (let i=1;i<cum.length;i++) {
    if (t <= cum[i]) {
      const len = cum[i]-cum[i-1]; const u = len===0?0:(t-cum[i-1])/len;
      const p0=path[i-1], p1=path[i];
      return { x: p0.x + (p1.x-p0.x)*u, y: p0.y + (p1.y-p0.y)*u };
    }
  }
  return path[path.length-1];
}

const DEFAULT_ROUTE = [
  { x: 10, y: 80 }, { x: 20, y: 70 }, { x: 35, y: 60 }, { x: 50, y: 50 },
  { x: 65, y: 40 }, { x: 80, y: 30 }, { x: 90, y: 20 }
];

const Map = ({ selectedBus }) => {
  const width = 700, height = 320, pad = 20;
  const route = selectedBus?.routePath || DEFAULT_ROUTE;
  const cum = useMemo(()=>buildCum(route), [route]);
  const total = cum[cum.length-1] || 1;

  const [d, setD] = useState(0);
  const rafRef = useRef(0);
  const speed = 18; // units/sec for animation

  useEffect(() => { setD(0); }, [selectedBus]);

  useEffect(() => {
    // animate if a bus is selected
    if (!selectedBus) return;
    const tick = (now) => {
      setD(prev => prev + speed/60); // ~60fps step
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [selectedBus]);

  const pos = useMemo(() => at(route, cum, d), [route, cum, d]);

  const toSvg = (p) => ({
    x: pad + (p.x/100) * (width - pad*2),
    y: pad + (p.y/100) * (height - pad*2)
  });
  const pathD = useMemo(() => {
    const pts = route.map(toSvg);
    return pts.map((p,i)=>`${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
  }, [route]);
  const svgPos = toSvg(pos);

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mt-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold">Live Map</h2>
        <div className="text-sm text-gray-600">{selectedBus ? selectedBus.label : 'Select a bus from the list'}</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 rounded-md bg-gray-100">
        <path d={pathD} stroke="#2563eb" strokeWidth="4" fill="none" strokeLinecap="round" />
        {selectedBus && (
          <g transform={`translate(${svgPos.x}, ${svgPos.y})`}>
            <circle r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
            <text y="-12" textAnchor="middle" className="fill-gray-800 text-xs">{selectedBus.short}</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Map;

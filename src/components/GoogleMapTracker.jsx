import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

function lerp(a, b, t) {
  return a + (b - a) * t;
}

const GoogleMapTracker = ({ busLabel, waypoints }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; 
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!apiKey || !waypoints || waypoints.length < 2) return;
    const loader = new Loader({ apiKey, version: "weekly" });

    let isCancelled = false;
    loader.load().then(() => {
      if (isCancelled) return;

      const center = waypoints[0];
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center,
        zoom: 14,
        mapId: "DEMO_MAP",
      });

      // Draw bus route
      new google.maps.Polyline({
        path: waypoints,
        map: mapInstance.current,
        strokeColor: "#2563eb",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });

      // Fit map to route
      const bounds = new google.maps.LatLngBounds();
      waypoints.forEach((p) => bounds.extend(p));
      mapInstance.current.fitBounds(bounds);

      // Bus marker
      markerRef.current = new google.maps.Marker({
        map: mapInstance.current,
        position: center,
        label: {
          text: busLabel,
          color: "#000",
          fontWeight: "700",
          fontSize: "14px",
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });

      // Animation loop
      const speed = 0.2;
      let seg = 0, t = 0, lastTime = performance.now();

      const tick = (now) => {
        if (!markerRef.current) return;
        const delta = (now - lastTime) / 1000;
        lastTime = now;

        const a = waypoints[seg];
        const b = waypoints[(seg + 1) % waypoints.length];
        const lat = lerp(a.lat, b.lat, t);
        const lng = lerp(a.lng, b.lng, t);

        markerRef.current.setPosition({ lat, lng });

        t += speed * delta;
        if (t >= 1) {
          t = 0;
          seg = (seg + 1) % waypoints.length;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      isCancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [apiKey, busLabel, waypoints]);

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm mt-6">
      <h2 className="text-2xl font-semibold mb-3">
        Tracking {busLabel} 🚍
      </h2>
      <div ref={mapRef} className="w-full h-96 rounded-lg" />
      {!apiKey && (
        <p className="mt-2 text-sm text-red-600">
          Google Maps API key missing (VITE_GOOGLE_MAPS_API_KEY).
        </p>
      )}
    </div>
  );
};

export default GoogleMapTracker;

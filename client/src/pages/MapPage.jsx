import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GoogleMapTracker from '../components/GoogleMapTracker';

// demo waypoints by id (adjust as desired)
const BUS_WAYPOINTS = {
  42: [
    { lat: 25.4484, lng: 78.5685 },
    { lat: 25.4520, lng: 78.5790 },
    { lat: 25.4580, lng: 78.5850 },
    { lat: 25.4655, lng: 78.5925 },
  ],
  7: [
    { lat: 25.4560, lng: 78.5660 },
    { lat: 25.4600, lng: 78.5750 },
    { lat: 25.4670, lng: 78.5820 },
  ],
  15: [
    { lat: 25.4400, lng: 78.5600 },
    { lat: 25.4450, lng: 78.5720 },
    { lat: 25.4520, lng: 78.5840 },
  ],
};

const MapPage = () => {
  const { id } = useParams();
  const waypoints = BUS_WAYPOINTS[Number(id)] || BUS_WAYPOINTS[42];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-dark-bg min-h-[calc(100vh-64px)] transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Live bus tracker</h2>
          <p className="text-gray-600 dark:text-dark-text-secondary">Now tracking: <span className="font-semibold dark:text-dark-text-primary">Bus {id}</span></p>
        </div>
        <Link to="/" className="inline-flex items-center rounded-xl bg-blue-100 dark:bg-blue-900/30 px-5 py-2.5 text-black dark:text-dark-text-primary font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">← Back to Home</Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <GoogleMapTracker busLabel={`Bus ${id}`} waypoints={waypoints} />
      </div>
    </main>
  );
};

export default MapPage;

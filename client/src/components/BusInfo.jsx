// src/components/BusInfo.jsx
import React from 'react';

const BusInfo = ({ busData }) => {
  return (
    <div className="bg-white shadow-lg p-6 rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Bus Information</h2>
      <p><strong>Bus Number:</strong> {busData.number}</p>
      <p><strong>Current Location:</strong> {busData.location}</p>
      <p><strong>ETA:</strong> {busData.eta}</p>
    </div>
  );
};

export default BusInfo;

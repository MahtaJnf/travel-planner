'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

type MapProps = {
  lat: number;
  lon: number;
};

// Fix Leaflet default marker icons (for Next.js static builds)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Map = ({ lat, lon }: MapProps) => {
  if (!lat || !lon) return null;

  // Ensure map container is cleaned up before mounting
  useEffect(() => {
    const container = document.getElementById('leaflet-map');
    if (container && (container as any)._leaflet_id) {
      (container as any)._leaflet_id = null;
    }
  }, [lat, lon]);

  return (
    <Box sx={{ height: 180, borderRadius: 3, overflow: 'hidden' }}>
      <MapContainer
        id="leaflet-map"
        center={[lat, lon]}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>Here is the city</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};

export default Map;

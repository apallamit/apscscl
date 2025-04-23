import { useEffect, useRef, useState } from 'react';
import { Map, Navigation } from 'lucide-react';

interface MapPreviewProps {
  lat?: number;
  lng?: number;
  googleLoaded: boolean;
}

export function MapPreview({ lat, lng, googleLoaded }: MapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [polygon, setPolygon] = useState<any>(null);

  // Initialize the map when coordinates are available
  useEffect(() => {
    if (!googleLoaded || !mapRef.current || !lat || !lng) return;

    try {
      // Create the map if it doesn't exist
      if (!map) {
        const mapOptions = {
          center: { lat, lng },
          zoom: 15,
          mapTypeId: window.google?.maps?.MapTypeId?.ROADMAP,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#7c93a3' }, { lightness: '-10' }]
            },
            {
              featureType: 'administrative.country',
              elementType: 'geometry',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#a0a4a5' }]
            },
            {
              featureType: 'administrative.province',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#62838e' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f3f3f3' }]
            },
            {
              featureType: 'landscape.natural',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#7c93a3' }, { lightness: '-10' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#b6d8ef' }]
            }
          ]
        };

        // Create the new map
        if (window.google?.maps) {
          const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
          setMap(newMap);
        }
      } else {
        // Update center if map exists
        map.setCenter({ lat, lng });
      }

      // Create or update marker
      if (!marker && window.google?.maps) {
        const newMarker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map || null,
          title: 'Selected Location',
          animation: window.google.maps.Animation?.DROP,
        });
        setMarker(newMarker);
      } else if (marker) {
        marker.setPosition({ lat, lng });
      }

      // Create or update geo-fencing polygon (a circle around the marker)
      // For demo purposes, we'll create a simple circle-like polygon with 20 points
      if (window.google?.maps) {
        const createCirclePolygon = (center: any, radius: number): any[] => {
          const points: any[] = [];
          const numPoints = 20;

          for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            const x = center.lat() + radius * Math.cos(angle) * 0.0009;
            const y = center.lng() + radius * Math.sin(angle) * 0.0009;
            points.push(new window.google.maps.LatLng(x, y));
          }

          return points;
        };

        const center = new window.google.maps.LatLng(lat, lng);
        const polygonCoords = createCirclePolygon(center, 200);

        if (!polygon) {
          const newPolygon = new window.google.maps.Polygon({
            paths: polygonCoords,
            strokeColor: '#3B82F6',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#3B82F6',
            fillOpacity: 0.2,
            map: map || null,
          });
          setPolygon(newPolygon);
        } else {
          polygon.setPath(polygonCoords);
          polygon.setMap(map);
        }
      }
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
    }
  }, [lat, lng, googleLoaded, map, marker, polygon]);

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-slate-800 overflow-hidden relative">
      {!googleLoaded ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <Map className="h-12 w-12 mb-2" />
          <p>Loading Google Maps...</p>
        </div>
      ) : lat && lng ? (
        <div ref={mapRef} className="w-full h-full" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <Navigation className="h-12 w-12 mb-2" />
          <p>No location data available</p>
        </div>
      )}
    </div>
  );
}

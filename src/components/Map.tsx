import React from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

type MapProps = {
  latitude?: number;
  longitude?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
};

export const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  onLocationSelect,
}) => {
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = React.useRef<mapboxgl.Map | null>(null);
  const markerRef = React.useRef<mapboxgl.Marker | null>(null);

  React.useEffect(() => {
    const MAP_API = process.env.NEXT_PUBLIC_MAP_API;
    if (!MAP_API) {
      console.error("NEXT_PUBLIC_MAP_API environment variable is not set");
      return;
    }
    mapboxgl.accessToken = MAP_API;
    if (mapContainerRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        bearing: 0,
        dragRotate: true,
        touchPitch: false,
        center: [0, 20],
        zoom: 1.5,
      });

      // Add fullscreen control
      mapInstanceRef.current.addControl(
        new mapboxgl.FullscreenControl(),
        "top-right"
      );
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // Update map center and marker when coords change
  React.useEffect(() => {
    if (
      mapInstanceRef.current &&
      latitude !== undefined &&
      longitude !== undefined
    ) {
      // Center and zoom to the location
      mapInstanceRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 10,
        duration: 1000,
      });

      // Remove existing marker if any and create new one
      if (markerRef.current) {
        markerRef.current.remove();
      }

      markerRef.current = new mapboxgl.Marker({ color: "#00cc00" })
        .setLngLat([longitude, latitude])
        .addTo(mapInstanceRef.current);
    } else if (mapInstanceRef.current) {
      // If coordinates are empty, zoom to world
      mapInstanceRef.current.flyTo({
        center: [0, 20],
        zoom: 1.5,
        duration: 1000,
      });
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [latitude, longitude]);

  // Handle map click to place marker and update coordinates
  React.useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Create new marker
      markerRef.current = new mapboxgl.Marker({ color: "#00cc00" })
        .setLngLat([lng, lat])
        .addTo(map);

      // Call callback with new coordinates
      onLocationSelect?.(lat, lng);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [onLocationSelect]);

  return <div ref={mapContainerRef} className="map-container" />;
};
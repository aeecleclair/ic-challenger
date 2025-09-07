"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import { CustomMarker } from "./custom-marker";
import { LocationFormMarker } from "./location-form-marker";

interface MapComponentProps {
  latitude?: number;
  longitude?: number;
  onCoordinatesChange: (lat: number, lng: number) => void;
  onLocationAdd?: (
    lat: number,
    lng: number,
    name: string,
    address: string,
  ) => void;
  onLocationDelete?: (lat: number, lng: number) => void;
  onLocationEdit?: (location: any) => void;
  onLocationCreate?: (data: any) => void;
  onLocationUpdate?: (locationId: string, data: any) => void;
  isLocationAdded?: boolean;
  locationName?: string;
  locations?: any[];
  form?: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isCreating?: boolean;
  editingLocation?: any;
  isCreateLoading?: boolean;
  isUpdateLoading?: boolean;
  isDeleteLoading?: boolean;
  onDelete?: (id: string) => void;
}

export default function MapComponent({
  latitude,
  longitude,
  onCoordinatesChange,
  onLocationAdd,
  onLocationDelete,
  onLocationEdit,
  onLocationCreate,
  onLocationUpdate,
  isLocationAdded = false,
  locationName,
  locations = [],
  form,
  onSubmit,
  onCancel,
  isCreating = false,
  editingLocation,
  isCreateLoading = false,
  isUpdateLoading = false,
  isDeleteLoading = false,
  onDelete,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const locationMarkersRef = useRef<any[]>([]);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);
  const onLocationAddRef = useRef(onLocationAdd);
  const onLocationDeleteRef = useRef(onLocationDelete);
  const onLocationEditRef = useRef(onLocationEdit);
  const onLocationCreateRef = useRef(onLocationCreate);
  const onLocationUpdateRef = useRef(onLocationUpdate);

  // Keep the callback refs updated
  useEffect(() => {
    onCoordinatesChangeRef.current = onCoordinatesChange;
  }, [onCoordinatesChange]);

  useEffect(() => {
    onLocationAddRef.current = onLocationAdd;
  }, [onLocationAdd]);

  useEffect(() => {
    onLocationDeleteRef.current = onLocationDelete;
  }, [onLocationDelete]);

  useEffect(() => {
    onLocationEditRef.current = onLocationEdit;
  }, [onLocationEdit]);

  useEffect(() => {
    onLocationCreateRef.current = onLocationCreate;
  }, [onLocationCreate]);

  useEffect(() => {
    onLocationUpdateRef.current = onLocationUpdate;
  }, [onLocationUpdate]);

  // Function to get location name from coordinates
  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();

      if (data.display_name) {
        // Try to get a concise name
        const address = data.address || {};
        return address.road && address.city
          ? `${address.road}, ${address.city}`
          : data.display_name.split(",").slice(0, 2).join(",").trim();
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Error getting location name:", error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Function to create custom marker with React component
  const createCustomMarker = useCallback(
    (
      L: any,
      lat: number,
      lng: number,
      name: string,
      isAdded: boolean,
      location?: any,
    ) => {
      // Create a div element to render React component into
      const markerDiv = document.createElement("div");
      markerDiv.className = "custom-marker-container";

      // Create React root and render appropriate marker component
      const root = createRoot(markerDiv);

      // Check if this location is being created/edited and should show the form
      const shouldShowForm =
        (location && editingLocation?.id === location.id) ||
        (isCreating &&
          !location &&
          Math.abs(lat - (latitude || 0)) < 0.0001 &&
          Math.abs(lng - (longitude || 0)) < 0.0001);

      if (shouldShowForm && form && onSubmit && onCancel) {
        root.render(
          <LocationFormMarker
            locationName={name}
            latitude={lat}
            longitude={lng}
            isAdded={isAdded}
            isExisting={!!location}
            address={location?.address || name}
            form={form}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isCreateLoading={isCreateLoading}
            isUpdateLoading={isUpdateLoading}
            isDeleteLoading={isDeleteLoading}
            onDelete={
              location && onDelete ? () => onDelete(location.id) : undefined
            }
            editingLocation={editingLocation}
          />,
        );
      } else {
        root.render(
          <CustomMarker
            locationName={name}
            latitude={lat}
            longitude={lng}
            isAdded={isAdded}
            isExisting={!!location}
            address={location?.address || name}
            existingLocation={location}
            onCreate={(data) => {
              if (onLocationCreateRef.current) {
                onLocationCreateRef.current(data);
              }
            }}
            onUpdate={(data) => {
              if (location && onLocationUpdateRef.current) {
                onLocationUpdateRef.current(location.id, data);
              }
            }}
            onSelect={(lat, lng, name, address) => {
              if (location && onLocationEditRef.current) {
                // If it's an existing location, edit it
                onLocationEditRef.current(location);
              } else if (onLocationAddRef.current) {
                // If it's a new location, add it
                onLocationAddRef.current(lat, lng, name, address);
              }
            }}
            onDelete={(lat, lng) => {
              if (location && onLocationDeleteRef.current) {
                onLocationDeleteRef.current(lat, lng);
              }
            }}
            onCancel={onCancel}
            isCreateLoading={isCreateLoading}
            isUpdateLoading={isUpdateLoading}
          />,
        );
      }

      const customIcon = L.divIcon({
        html: markerDiv,
        className: "custom-react-marker",
        iconSize: [400, 380], // Fixed size for consistency
        iconAnchor: [200, 435], // Point at the very tip of the triangular pointer
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Store the root for cleanup
      (marker as any)._reactRoot = root;

      return marker;
    },
    [
      form,
      onSubmit,
      onCancel,
      isCreating,
      editingLocation,
      latitude,
      longitude,
      isCreateLoading,
      isUpdateLoading,
      isDeleteLoading,
      onDelete,
    ],
  );

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues
    const initMap = async () => {
      const L = await import("leaflet");

      // Default center (Lyon)
      const defaultCenter: [number, number] = [45.782871, 4.769279];

      // Create map - mapRef.current is guaranteed to exist here
      mapInstanceRef.current = L.map(mapRef.current!).setView(
        defaultCenter,
        13,
      );

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Add click handler
      mapInstanceRef.current.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        onCoordinatesChangeRef.current(lat, lng);

        // Get location name
        const name = await getLocationName(lat, lng);

        // Remove existing marker (with cleanup)
        if (markerRef.current) {
          // Cleanup React root if it exists - defer to avoid race condition
          if ((markerRef.current as any)._reactRoot) {
            const rootToCleanup = (markerRef.current as any)._reactRoot;
            setTimeout(() => {
              rootToCleanup.unmount();
            }, 0);
          }
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Add new custom marker
        markerRef.current = createCustomMarker(L, lat, lng, name, false);
        markerRef.current.addTo(mapInstanceRef.current);

        // Center the map so the marker center is at the center of the viewport
        const zoom = mapInstanceRef.current.getZoom();

        // Get actual map container size for proper calculation
        const mapContainer = mapInstanceRef.current.getContainer();
        const mapHeight = mapContainer.clientHeight;

        // Marker dimensions: 380px height, anchor at [200, 435]
        // Visual center of marker is approximately at 190px above the coordinate (half of 380px)
        // To center the marker visually, shift up by this amount
        const pixelsToShift = 160;

        // Convert pixels to degrees using proper Web Mercator formula
        // At zoom level z, 1 degree latitude = (256 * 2^z) / 360 pixels at equator
        const pixelsPerDegree = (256 * Math.pow(2, zoom)) / 360;
        const latOffset = pixelsToShift / pixelsPerDegree;

        mapInstanceRef.current.setView([lat + latOffset, lng], zoom, {
          animate: true,
          duration: 0.5,
        });
      });
    };

    initMap().catch(console.error);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        // Cleanup React root if it exists - defer to avoid race condition
        if (markerRef.current && (markerRef.current as any)._reactRoot) {
          const rootToCleanup = (markerRef.current as any)._reactRoot;
          setTimeout(() => {
            rootToCleanup.unmount();
          }, 0);
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [
    isCreating,
    editingLocation,
    latitude,
    longitude,
    form,
    onSubmit,
    onCancel,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    onDelete,
    createCustomMarker,
  ]);

  // Update marker when coordinates change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateMarker = async () => {
      const L = await import("leaflet");

      if (latitude && longitude) {
        // Remove existing marker (with cleanup)
        if (markerRef.current) {
          // Cleanup React root if it exists - defer to avoid race condition
          if ((markerRef.current as any)._reactRoot) {
            const rootToCleanup = (markerRef.current as any)._reactRoot;
            setTimeout(() => {
              rootToCleanup.unmount();
            }, 0);
          }
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Get location name if not provided
        const name =
          locationName || (await getLocationName(latitude, longitude));

        // Create custom marker
        markerRef.current = createCustomMarker(
          L,
          latitude,
          longitude,
          name,
          isLocationAdded,
        );
        markerRef.current.addTo(mapInstanceRef.current);

        mapInstanceRef.current.setView([latitude, longitude], 13);
      } else if (markerRef.current) {
        // Cleanup React root if it exists - defer to avoid race condition
        if ((markerRef.current as any)._reactRoot) {
          const rootToCleanup = (markerRef.current as any)._reactRoot;
          setTimeout(() => {
            rootToCleanup.unmount();
          }, 0);
        }
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };

    updateMarker().catch(console.error);
  }, [
    latitude,
    longitude,
    isLocationAdded,
    locationName,
    createCustomMarker,
    form,
    onSubmit,
    onCancel,
    isCreating,
    editingLocation,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    onDelete,
  ]);

  // Center map when editing a location
  useEffect(() => {
    if (
      editingLocation &&
      editingLocation.latitude &&
      editingLocation.longitude &&
      mapInstanceRef.current
    ) {
      setTimeout(() => {
        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          const zoom = map.getZoom();

          // Get actual map container size for proper calculation
          const mapContainer = map.getContainer();
          const mapHeight = mapContainer.clientHeight;

          // Marker dimensions: 380px height, anchor at [200, 435]
          // Visual center of marker is approximately at 190px above the coordinate (half of 380px)
          // To center the marker visually, shift up by this amount
          const pixelsToShift = 160;

          // Convert pixels to degrees using proper Web Mercator formula
          // At zoom level z, 1 degree latitude = (256 * 2^z) / 360 pixels at equator
          const pixelsPerDegree = (256 * Math.pow(2, zoom)) / 360;
          const latOffset = pixelsToShift / pixelsPerDegree;

          map.setView(
            [editingLocation.latitude + latOffset, editingLocation.longitude],
            zoom,
            {
              animate: true,
              duration: 0.5,
            },
          );
        }
      }, 100);
    }
  }, [editingLocation]);

  // Update location markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !locations) return;

    const updateLocationMarkers = async () => {
      const L = await import("leaflet");

      // Clear existing location markers
      locationMarkersRef.current.forEach((marker) => {
        if (marker && (marker as any)._reactRoot) {
          const rootToCleanup = (marker as any)._reactRoot;
          setTimeout(() => {
            rootToCleanup.unmount();
          }, 0);
        }
        if (mapInstanceRef.current && marker) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      locationMarkersRef.current = [];

      // Add markers for all locations
      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          const marker = createCustomMarker(
            L,
            location.latitude,
            location.longitude,
            location.name || "Lieu sans nom",
            true, // All existing locations are "added"
            location,
          );
          marker.addTo(mapInstanceRef.current);
          locationMarkersRef.current.push(marker);
        }
      });
    };

    updateLocationMarkers().catch(console.error);
  }, [locations, createCustomMarker, editingLocation]);

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-md border border-input overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}

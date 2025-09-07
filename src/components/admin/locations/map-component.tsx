"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import { SimpleLocationMarker } from "./simple-location-marker";
import { LocationFormMarker } from "./location-form-marker";

interface MapComponentProps {
  latitude?: number;
  longitude?: number;
  onCoordinatesChange: (lat: number, lng: number, address: string) => void;
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
  const addMarkerRef = useRef<any>(null); // For the temporary add marker
  const locationMarkersRef = useRef<any[]>([]); // For existing location markers
  const editMarkerRef = useRef<any>(null); // For the edit marker

  // Function to get location name from coordinates
  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();

      if (data.display_name) {
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

  // Create simple marker for existing locations
  const createLocationMarker = useCallback(
    (L: any, lat: number, lng: number, location: any) => {
      const markerDiv = document.createElement("div");
      markerDiv.className = "location-marker-container";

      const root = createRoot(markerDiv);
      root.render(
        <SimpleLocationMarker
          locationName={location.name || location.address || "Lieu sans nom"}
          address={location.address}
          latitude={lat}
          longitude={lng}
          onClick={() => {
            if (onLocationEdit) {
              onLocationEdit(location);
            }
          }}
        />,
      );

      const customIcon = L.divIcon({
        html: markerDiv,
        className: "location-marker-icon",
        iconSize: [220, 50],
        iconAnchor: [110, 85],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Prevent map click when clicking on marker
      marker.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
      });

      // Store the root for cleanup
      (marker as any)._reactRoot = root;

      return marker;
    },
    [onLocationEdit],
  );

  // Create edit form marker for editing location
  const createEditMarker = useCallback(
    (L: any, lat: number, lng: number, location: any, name: string) => {
      const markerDiv = document.createElement("div");
      markerDiv.className = "edit-marker-container";

      const root = createRoot(markerDiv);
      root.render(
        <LocationFormMarker
          locationName={name}
          latitude={lat}
          longitude={lng}
          isAdded={true}
          address={location?.address || name}
          form={form}
          onSubmit={onSubmit || (() => {})}
          onCancel={onCancel || (() => {})}
          isCreateLoading={isCreateLoading}
          isUpdateLoading={isUpdateLoading}
          isDeleteLoading={isDeleteLoading}
          onDelete={
            location && onDelete ? () => onDelete(location.id) : undefined
          }
          editingLocation={editingLocation}
          isExisting={true}
        />,
      );

      const customIcon = L.divIcon({
        html: markerDiv,
        className: "edit-marker-icon",
        iconSize: [400, 380],
        iconAnchor: [200, 435],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Prevent map click when clicking on marker
      marker.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
      });

      // Store the root for cleanup
      (marker as any)._reactRoot = root;

      return marker;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Remove all dependencies to prevent frequent re-creation
  );

  // Create add form marker for new location
  const createAddMarker = useCallback(
    (L: any, lat: number, lng: number, name: string) => {
      const markerDiv = document.createElement("div");
      markerDiv.className = "add-marker-container";

      const root = createRoot(markerDiv);
      root.render(
        <LocationFormMarker
          locationName={name}
          latitude={lat}
          longitude={lng}
          isAdded={false}
          address={name}
          form={form}
          onSubmit={onSubmit || (() => {})}
          onCancel={onCancel || (() => {})}
          isCreateLoading={isCreateLoading}
          isUpdateLoading={isUpdateLoading}
          isDeleteLoading={isDeleteLoading}
          editingLocation={null}
          isExisting={false}
        />,
      );

      const customIcon = L.divIcon({
        html: markerDiv,
        className: "add-marker-icon",
        iconSize: [400, 380],
        iconAnchor: [200, 435],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Prevent map click when clicking on marker
      marker.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
      });

      // Store the root for cleanup
      (marker as any)._reactRoot = root;

      return marker;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Remove all dependencies to prevent frequent re-creation
  );

  // Cleanup marker function
  const cleanupMarker = (marker: any) => {
    if (marker && (marker as any)._reactRoot) {
      const rootToCleanup = (marker as any)._reactRoot;
      setTimeout(() => {
        try {
          rootToCleanup.unmount();
        } catch (error) {
          console.warn("Error unmounting marker root:", error);
        }
      }, 0);
    }
    if (mapInstanceRef.current && marker) {
      mapInstanceRef.current.removeLayer(marker);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const container = mapRef.current;

    const initMap = async () => {
      const L = await import("leaflet");

      if ((container as any)._leaflet_id) {
        console.warn(
          "Map container already has a Leaflet instance, skipping initialization",
        );
        return;
      }

      // Default center (Lyon)
      const defaultCenter: [number, number] = [45.782871, 4.769279];

      // Create map
      mapInstanceRef.current = L.map(container).setView(defaultCenter, 13);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Add click handler for map
      mapInstanceRef.current.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;

        // Clear any existing add marker
        if (addMarkerRef.current) {
          cleanupMarker(addMarkerRef.current);
          addMarkerRef.current = null;
        }

        // Only show add marker if not currently editing
        if (!editingLocation) {
          // Get location name
          const name = await getLocationName(lat, lng);

          onCoordinatesChange(lat, lng, name);

          // Create add marker inline to avoid dependency issues
          const markerDiv = document.createElement("div");
          markerDiv.className = "add-marker-container";

          // Create wrapper function for onCancel that also removes the add marker
          const handleAddCancel = () => {
            // Remove the add marker
            if (addMarkerRef.current) {
              cleanupMarker(addMarkerRef.current);
              addMarkerRef.current = null;
            }
            // Call the original onCancel
            if (onCancel) {
              onCancel();
            }
          };

          const root = createRoot(markerDiv);
          root.render(
            <LocationFormMarker
              locationName={name}
              latitude={lat}
              longitude={lng}
              isAdded={false}
              address={name}
              form={form}
              onSubmit={onSubmit || (() => {})}
              onCancel={handleAddCancel}
              isCreateLoading={isCreateLoading}
              isUpdateLoading={isUpdateLoading}
              isDeleteLoading={isDeleteLoading}
              editingLocation={null}
              isExisting={false}
            />,
          );

          const customIcon = L.divIcon({
            html: markerDiv,
            className: "add-marker-icon",
            iconSize: [400, 380],
            iconAnchor: [200, 435],
          });

          addMarkerRef.current = L.marker([lat, lng], { icon: customIcon });

          // Prevent map click when clicking on marker
          addMarkerRef.current.on("click", (e: any) => {
            L.DomEvent.stopPropagation(e);
          });

          // Store the root for cleanup
          (addMarkerRef.current as any)._reactRoot = root;

          addMarkerRef.current.addTo(mapInstanceRef.current);

          // Center the map with offset for marker
          const zoom = mapInstanceRef.current.getZoom();
          const pixelsToShift = 160;
          const pixelsPerDegree = (256 * Math.pow(2, zoom)) / 360;
          const latOffset = pixelsToShift / pixelsPerDegree;

          mapInstanceRef.current.setView([lat + latOffset, lng], zoom, {
            animate: true,
            duration: 0.5,
          });
        }
      });
    };

    initMap().catch(console.error);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        // Cleanup all markers
        if (addMarkerRef.current) {
          cleanupMarker(addMarkerRef.current);
        }
        if (editMarkerRef.current) {
          cleanupMarker(editMarkerRef.current);
        }
        locationMarkersRef.current.forEach(cleanupMarker);

        // Remove the map instance
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        addMarkerRef.current = null;
        editMarkerRef.current = null;
        locationMarkersRef.current = [];

        // Clear the Leaflet container reference
        delete (container as any)._leaflet_id;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update location markers when locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !locations) return;

    const updateLocationMarkers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));

      if (!mapInstanceRef.current) return;

      const L = await import("leaflet");

      // Clear existing location markers
      locationMarkersRef.current.forEach(cleanupMarker);
      locationMarkersRef.current = [];

      // Add markers for all locations
      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          // Don't show location marker if this location is being edited
          if (!editingLocation || editingLocation.id !== location.id) {
            const marker = createLocationMarker(
              L,
              location.latitude,
              location.longitude,
              location,
            );

            if (mapInstanceRef.current) {
              marker.addTo(mapInstanceRef.current);
              locationMarkersRef.current.push(marker);
            }
          }
        }
      });
    };

    updateLocationMarkers().catch(console.error);
  }, [locations, editingLocation, createLocationMarker]);

  // Handle editing location
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateEditMarker = async () => {
      const L = await import("leaflet");

      // Clear existing edit marker
      if (editMarkerRef.current) {
        cleanupMarker(editMarkerRef.current);
        editMarkerRef.current = null;
      }

      // Clear add marker when editing
      if (addMarkerRef.current) {
        cleanupMarker(addMarkerRef.current);
        addMarkerRef.current = null;
      }

      // Create edit marker if editing
      if (
        editingLocation &&
        editingLocation.latitude &&
        editingLocation.longitude
      ) {
        const locationName =
          editingLocation.name || editingLocation.address || "Lieu sans nom";

        // Create wrapper function for onCancel that also removes the edit marker
        const handleEditCancel = () => {
          // Remove the edit marker
          if (editMarkerRef.current) {
            cleanupMarker(editMarkerRef.current);
            editMarkerRef.current = null;
          }
          // Call the original onCancel
          if (onCancel) {
            onCancel();
          }
        };

        // Create the marker directly here to avoid dependency issues
        const markerDiv = document.createElement("div");
        markerDiv.className = "edit-marker-container";

        const root = createRoot(markerDiv);
        root.render(
          <LocationFormMarker
            locationName={locationName}
            latitude={editingLocation.latitude}
            longitude={editingLocation.longitude}
            isAdded={true}
            address={editingLocation.address || locationName}
            form={form}
            onSubmit={onSubmit || (() => {})}
            onCancel={handleEditCancel}
            isCreateLoading={isCreateLoading}
            isUpdateLoading={isUpdateLoading}
            isDeleteLoading={isDeleteLoading}
            onDelete={onDelete ? () => onDelete(editingLocation.id) : undefined}
            editingLocation={editingLocation}
            isExisting={true}
          />,
        );

        const customIcon = L.divIcon({
          html: markerDiv,
          className: "edit-marker-icon",
          iconSize: [400, 380],
          iconAnchor: [200, 435],
        });

        editMarkerRef.current = L.marker(
          [editingLocation.latitude, editingLocation.longitude],
          { icon: customIcon },
        );

        // Prevent map click when clicking on marker
        editMarkerRef.current.on("click", (e: any) => {
          L.DomEvent.stopPropagation(e);
        });

        // Store the root for cleanup
        (editMarkerRef.current as any)._reactRoot = root;

        if (mapInstanceRef.current) {
          editMarkerRef.current.addTo(mapInstanceRef.current);

          // Center the map with offset for marker
          const zoom = mapInstanceRef.current.getZoom();
          const pixelsToShift = 160;
          const pixelsPerDegree = (256 * Math.pow(2, zoom)) / 360;
          const latOffset = pixelsToShift / pixelsPerDegree;

          mapInstanceRef.current.setView(
            [editingLocation.latitude + latOffset, editingLocation.longitude],
            zoom,
            {
              animate: true,
              duration: 0.5,
            },
          );
        }
      }
    };

    updateEditMarker().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingLocation]); // Only depend on editingLocation to minimize re-renders

  // Handle creating mode
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear add marker when not creating
    if (!isCreating && addMarkerRef.current) {
      cleanupMarker(addMarkerRef.current);
      addMarkerRef.current = null;
    }
  }, [isCreating]);

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-md border border-input overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}

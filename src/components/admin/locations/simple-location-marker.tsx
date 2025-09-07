"use client";

import React from "react";
import { MapPin } from "lucide-react";

interface SimpleLocationMarkerProps {
  locationName: string;
  onClick: () => void;
}

export function SimpleLocationMarker({
  locationName,
  onClick,
}: SimpleLocationMarkerProps) {
  return (
    <div
      className="simple-location-marker"
      style={{
        width: "40px",
        height: "40px",
        background: "#2563eb", // Blue color for existing locations
        border: "3px solid white",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        transition: "all 0.2s ease",
      }}
      onClick={(e) => {
        e.stopPropagation(); // Prevent the click from bubbling to the map
        onClick();
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.background = "#1d4ed8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.background = "#2563eb";
      }}
      title={locationName}
    >
      <MapPin size={20} fill="white" />
    </div>
  );
}

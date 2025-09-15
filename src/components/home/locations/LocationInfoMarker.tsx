"use client";

import React from "react";
import { useSports } from "@/src/hooks/useSports";
import { MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { LocationComplete, Match } from "@/src/api/hyperionSchemas";

interface LocationInfoMarkerProps {
  location: LocationComplete;
  hasMatches: boolean;
  totalMatches: number;
  nextMatch?: Match;
  sports?: any[];
  schools?: any[];
}

export function LocationInfoMarker({
  location,
  hasMatches,
  totalMatches,
  nextMatch,
  sports,
  schools,
}: LocationInfoMarkerProps) {
  const openInMaps = () => {
    if (location.latitude && location.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
        "_blank",
      );
    }
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const markerRef = React.useRef<HTMLDivElement>(null);

  // Close info card on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        markerRef.current &&
        !markerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);
  return (
    <div
      ref={markerRef}
      className="relative flex flex-col items-center select-none"
      style={{ minWidth: 60 }}
    >
      {/* Info card, only when open */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          {/* Bottom triangle for popup anchor */}
          <div className="absolute left-1/2 top-full transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          </div>
          <div className="w-[300px] sm:w-[350px] bg-white rounded-lg shadow-lg p-4 border">
            <div className="flex items-start gap-3">
              <div className="bg-rose-500/10 p-2 rounded-full shrink-0">
                <MapPin className="h-6 w-6 text-rose-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-medium text-base truncate">
                    {location.name}
                  </h3>
                  {hasMatches && (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-green-500 text-green-600 text-xs"
                      >
                        Actif
                      </Badge>
                      <Badge variant="destructive" className="text-xs px-2">
                        {totalMatches} match{totalMatches !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  )}
                </div>
                {location.description && (
                  <p className="text-sm font-medium text-muted-foreground">
                    {location.description}
                  </p>
                )}
                {location.address && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    <MapPin className="h-3 w-3 inline mr-1 opacity-70" />
                    {location.address}
                  </p>
                )}
              </div>
            </div>

            {/* Categories: sports, matches, etc. */}
            {/* Next match pretty display */}
            {nextMatch && (
              <div className="bg-muted rounded p-2 mt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-xs">Prochain match</div>
                  {nextMatch.date && (
                    <Badge variant="default" className="text-xs font-mono">
                      <MapPin className="h-3 w-3 mr-1" />
                      {(() => {
                        const now = new Date();
                        const matchDate = new Date(nextMatch.date);
                        const diffMinutes = Math.round(
                          (matchDate.getTime() - now.getTime()) / (1000 * 60),
                        );
                        if (diffMinutes < 0) return "Passé";
                        if (diffMinutes < 60) return `${diffMinutes}min`;
                        const hours = Math.floor(diffMinutes / 60);
                        const minutes = diffMinutes % 60;
                        if (minutes === 0) return `${hours}h`;
                        return `${hours}h${minutes.toString().padStart(2, "0")}`;
                      })()}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {nextMatch?.sport_id &&
                    Array.isArray(sports) &&
                    (() => {
                      const sportObj = sports.find(
                        (s: any) => s.id === nextMatch.sport_id,
                      );
                      return sportObj ? (
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                          {sportObj.name}
                        </Badge>
                      ) : null;
                    })()}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  {nextMatch?.team1 && (
                    <span className="transition-colors text-primary font-semibold">
                      {nextMatch.team1.name}
                    </span>
                  )}
                  <span className="text-muted-foreground font-medium">vs</span>
                  {nextMatch?.team2 && (
                    <span className="transition-colors text-primary font-semibold">
                      {nextMatch.team2.name}
                    </span>
                  )}
                </div>
                {nextMatch.date && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {new Date(nextMatch.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <MapPin className="h-3 w-3 ml-2" />
                    <span>
                      {new Date(nextMatch.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
                {nextMatch.location && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const loc = nextMatch.location;
                      const query = loc?.address
                        ? `${loc?.name ?? ""}, ${loc?.address ?? ""}`
                        : loc?.name ?? "";
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                        "_blank",
                      );
                    }}
                    className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 hover:bg-slate-100 p-2 rounded-lg transition-colors w-full justify-start h-auto mt-2"
                  >
                    <MapPin className="h-4 w-4" />
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium text-gray-700">
                        {nextMatch.location?.name ?? ""}
                      </span>
                      {nextMatch.location?.address && (
                        <span className="text-xs text-gray-500">
                          {nextMatch.location.address}
                        </span>
                      )}
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-xs font-medium">Naviguer</span>
                    </div>
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const loc = location;
                const query = loc?.address
                  ? `${loc?.name ?? ""}, ${loc?.address ?? ""}`
                  : loc?.name ?? "";
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                  "_blank",
                );
              }}
              className="flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 hover:bg-slate-100 p-2 rounded-lg transition-colors w-full justify-start h-auto"
            >
              <MapPin className="h-4 w-4" />
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium text-gray-700">
                  {location?.name ?? ""}
                </span>
                {location?.address && (
                  <span className="text-xs text-gray-500">
                    {location.address}
                  </span>
                )}
              </div>
              <div className="ml-auto flex items-center gap-1">
                <span className="text-xs font-medium">Naviguer</span>
              </div>
            </Button> 
          </div>
        </div>
      )}
      {/* The pin itself, always at the bottom center */}
      <div
        className="cursor-pointer"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          zIndex: 3,
        }}
        onClick={() => setIsOpen((open) => !open)}
      >
        <MapPin
          className={`w-8 h-8 ${hasMatches ? "text-rose-500" : "text-gray-700"} drop-shadow-lg`}
          fill="currentColor"
          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
        />
        {hasMatches && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 min-w-[18px] h-4 flex items-center justify-center text-xs px-1"
          >
            {totalMatches}
          </Badge>
        )}
      </div>
    </div>
  );
}

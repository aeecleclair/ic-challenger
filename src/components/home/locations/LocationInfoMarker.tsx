"use client";

import React from "react";
import { useSports } from "@/src/hooks/useSports";
import { MapPin, Calendar, Clock, Search, ChevronRight } from "lucide-react";
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
import { Separator } from "@/src/components/ui/separator";
import {
  LocationComplete,
  Match,
  MatchComplete,
} from "@/src/api/hyperionSchemas";

interface LocationInfoMarkerProps {
  location: LocationComplete;
  hasMatches: boolean;
  totalMatches: number;
  nextMatch?: MatchComplete;
  upcomingMatches?: MatchComplete[];
  sports?: any[];
}

export function LocationInfoMarker({
  location,
  hasMatches,
  totalMatches,
  nextMatch,
  upcomingMatches = [],
  sports,
}: LocationInfoMarkerProps) {
  const openInMaps = () => {
    if (location.latitude && location.longitude) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
        "_blank",
      );
    }
  };

  const navigateToSearchWithLocation = () => {
    const params = new URLSearchParams();
    params.set("location", location.id);
    window.location.href = `/search?${params.toString()}`;
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.round(
      (date.getTime() - now.getTime()) / (1000 * 60),
    );

    let timeDisplay = "";
    if (diffMinutes < 0) timeDisplay = "Passé";
    else if (diffMinutes < 60) timeDisplay = `${diffMinutes}min`;
    else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      timeDisplay =
        minutes === 0
          ? `${hours}h`
          : `${hours}h${minutes.toString().padStart(2, "0")}`;
    }

    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeUntil: timeDisplay,
    };
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

            {/* Next match pretty display */}
            {nextMatch && (
              <div className="bg-muted rounded p-2 mt-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-xs">Prochain match</div>
                  {nextMatch.date && (
                    <Badge variant="default" className="text-xs font-mono">
                      <Clock className="h-3 w-3 mr-1" />
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
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(nextMatch.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>
                      {new Date(nextMatch.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Upcoming matches list */}
            {upcomingMatches.length > 0 && (
              <div className="mt-3">
                <Separator className="mb-3" />
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Matchs à venir ({upcomingMatches.length})
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateToSearchWithLocation}
                    className="text-xs h-6 px-2"
                  >
                    <Search className="h-3 w-3 mr-1" />
                    Voir tous
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {upcomingMatches.slice(0, 3).map((match) => {
                    const matchDate = formatMatchDate(match.date!);
                    const sport = sports?.find(
                      (s: any) => s.id === match.sport_id,
                    );

                    return (
                      <div
                        key={match.id}
                        className="bg-muted/50 rounded p-2 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {matchDate.date}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {matchDate.time}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0"
                          >
                            {matchDate.timeUntil}
                          </Badge>
                        </div>
                        {sport && (
                          <Badge
                            variant="secondary"
                            className="text-xs mb-1 px-2 py-0"
                          >
                            {sport.name}
                          </Badge>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-medium">
                              {match.team1?.name}
                            </span>
                            <span className="text-muted-foreground">vs</span>
                            <span className="font-medium">
                              {match.team2?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {upcomingMatches.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={navigateToSearchWithLocation}
                      className="w-full h-6 text-xs text-muted-foreground"
                    >
                      +{upcomingMatches.length - 3} matchs supplémentaires
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-3">
              <Separator className="mb-3" />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToSearchWithLocation}
                  className="flex items-center gap-2 text-xs flex-1"
                >
                  <Search className="h-3 w-3" />
                  Voir les matchs
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const query = location.address
                      ? `${location.name}, ${location.address}`
                      : location.name;
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                      "_blank",
                    );
                  }}
                  className="flex items-center gap-2 text-xs flex-1"
                >
                  <MapPin className="h-3 w-3" />
                  Naviguer
                </Button>
              </div>
            </div>
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

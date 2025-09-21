import { useMemo } from "react";
import { useSports } from "./useSports";
import { useSchools } from "./useSchools";
import { useSportMatches } from "./useMatches";
import { useAuth } from "./useAuth";
import { Match } from "@/src/api/hyperionSchemas";

interface UseAllMatchesProps {
  sportId?: string;
  schoolId?: string;
}

export const useAllMatches = ({
  sportId,
  schoolId,
}: UseAllMatchesProps = {}) => {
  const { sports } = useSports();

  // If no specific filters, get matches from the first available sport as a fallback
  const defaultSportId = sports?.[0]?.id;

  // Get matches by sport - use selected sport or default to first sport
  const { sportMatches } = useSportMatches({
    sportId: sportId && sportId !== "all" ? sportId : defaultSportId,
  });

  // For now, we'll work with sport matches and do client-side filtering
  // This is simpler than trying to combine multiple API endpoints
  const allMatches = useMemo(() => {
    return sportMatches || [];
  }, [sportMatches]);

  const refetch = () => {
    // Sport refetch is handled automatically by useSportMatches
  };

  return {
    matches: allMatches,
    refetch,
    isLoading: false,
  };
};

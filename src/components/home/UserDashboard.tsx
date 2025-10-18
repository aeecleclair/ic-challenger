"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Clock,
  Calendar,
  Trophy,
  Users,
  GraduationCap,
  Zap,
  MapPin,
  Bell,
  TrendingUp,
  Star,
  AlertCircle,
  Activity,
  Target,
  Medal,
  Megaphone,
  Camera,
  Heart,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserStatusBadges } from "./UserStatusBadges";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  CompetitionEdition,
  CompetitionUser,
  MatchComplete,
} from "@/src/api/hyperionSchemas";
import { useAllMatches } from "@/src/hooks/useAllMatches";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { useLocations } from "@/src/hooks/useLocations";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useVolunteerShifts } from "@/src/hooks/useVolunteerShifts";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { usePodiums } from "@/src/hooks/usePodiums";

interface UserDashboardProps {
  edition: CompetitionEdition;
  meCompetition?: CompetitionUser | null;
}

export const UserDashboard = ({
  edition,
  meCompetition,
}: UserDashboardProps) => {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  const { matches: allMatches } = useAllMatches();
  const { sports } = useSports();
  const { sportSchools, NoSchoolId } = useSportSchools();
  const { locations } = useLocations();
  const { meParticipant } = useParticipant();
  const { volunteerShifts } = useVolunteerShifts();
  const { globalPodium } = usePodiums();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const processedData = useMemo(() => {
    if (!allMatches || !sports || !sportSchools || !locations) {
      return {
        liveMatches: [] as MatchComplete[],
        todaySchedule: [],
        participantUpcomingMatches: [] as MatchComplete[],
        volunteerNextShifts: [],
      };
    }

    const now = new Date();
    const today = now.toDateString();

    const todaysMatches = allMatches.filter(
      (match) => match.date && new Date(match.date).toDateString() === today,
    );

    const liveMatches = todaysMatches.filter(
      (match) => !match.winner_id && match.date && new Date(match.date) <= now,
    );

    const todaySchedule = todaysMatches
      .filter((match) => match.date)
      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
      .slice(0, 5)
      .map((match) => ({
        time: new Date(match.date!).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        event: `${sports.find((s) => s.id === match.sport_id)?.name || "Sport"}`,
        teams: `${match.team1?.name || "Équipe 1"} vs ${match.team2?.name || "Équipe 2"}`,
        location:
          locations.find((l) => l.id === match.location_id)?.name ||
          "Lieu non défini",
      }));

    const schoolStats = sportSchools.reduce((acc: any[], school) => {
      if (school.school_id === NoSchoolId) {
        return acc;
      }

      const schoolMatches = allMatches.filter(
        (match) =>
          match.team1?.school_id === school.school_id ||
          match.team2?.school_id === school.school_id,
      );

      const wins = schoolMatches.filter((match) => {
        if (!match.winner_id) return false;
        const winnerTeam = allMatches.find(
          (m) =>
            (m.team1_id === match.winner_id ||
              m.team2_id === match.winner_id) &&
            (m.team1?.school_id === school.school_id ||
              m.team2?.school_id === school.school_id),
        );
        return (
          winnerTeam?.team1?.school_id === school.school_id ||
          winnerTeam?.team2?.school_id === school.school_id
        );
      }).length;

      acc.push({
        rank: 0,
        school: school.school.name,
        points: wins * 3,
        wins: wins,
      });
      return acc;
    }, []);

    schoolStats.sort((a, b) => b.points - a.points);
    schoolStats.forEach((stat, index) => {
      stat.rank = index + 1;
    });

    // Participant upcoming matches (multiple matches)
    let participantUpcomingMatches: MatchComplete[] = [];
    if (meParticipant?.team_id) {
      const userMatches = allMatches.filter(
        (match) =>
          match.team1_id === meParticipant.team_id ||
          match.team2_id === meParticipant.team_id,
      );

      participantUpcomingMatches = userMatches
        .filter((match) => match.date && new Date(match.date) > now)
        .sort(
          (a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime(),
        )
        .slice(0, 3);
    }

    // Volunteer next shifts
    let volunteerNextShifts: any[] = [];
    if (meCompetition?.is_volunteer && volunteerShifts) {
      volunteerNextShifts = volunteerShifts
        .filter((shift) => shift.start_time && new Date(shift.start_time) > now)
        .sort(
          (a, b) =>
            new Date(a.start_time!).getTime() -
            new Date(b.start_time!).getTime(),
        )
        .slice(0, 3)
        .map((shift) => ({
          id: shift.id,
          name: shift.name || "Créneaux bénévole",
          start: shift.start_time!,
          end: shift.end_time,
          location: shift.location || "Lieu non défini",
        }));
    }

    return {
      liveMatches,
      todaySchedule,
      standings: schoolStats.slice(0, 3),
      participantUpcomingMatches,
      volunteerNextShifts,
    };
  }, [
    allMatches,
    sports,
    sportSchools,
    locations,
    meParticipant,
    NoSchoolId,
    volunteerShifts,
    meCompetition,
  ]);

  const getTimeUntilEvent = (eventDate: string) => {
    const now = currentTime;
    const event = new Date(eventDate);
    const diffMinutes = Math.round(
      (event.getTime() - now.getTime()) / (1000 * 60),
    );

    if (diffMinutes < 0) return "En cours";
    if (diffMinutes < 60) return `${diffMinutes}min`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h${minutes > 0 ? minutes.toString().padStart(2, "0") : ""}`;
  };

  return (
    <div className="space-y-4">
      {/*  Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {edition?.name} {edition?.year}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Activity className="h-3 w-3 mr-1" />
              En cours
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              •{" "}
              {currentTime.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-4 md:grid-cols-${meCompetition?.is_athlete ? 1 : 0 + (meCompetition?.is_volunteer ? 1 : 0)}`}
      >
        <div className="space-y-4">
          {/* Participant Upcoming Matches */}
          {meCompetition?.is_athlete &&
            processedData.participantUpcomingMatches !== undefined &&
            processedData.participantUpcomingMatches.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Vos Prochains Matchs (
                    {processedData.participantUpcomingMatches.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {processedData.participantUpcomingMatches.map((match) => (
                      <div
                        key={match.id}
                        className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">
                            {match.team1.name} vs {match.team2.name}
                          </span>
                          <span className="font-bold text-green-600 text-lg">
                            {getTimeUntilEvent(match.date)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            {sports?.find((s) => s.id === match.sport_id)?.name}
                          </span>
                          <span>
                            {
                              locations?.find((l) => l.id === match.location_id)
                                ?.name
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
        <div className="space-y-4">
          {/* Volunteer Next Shifts */}
          {meCompetition?.is_volunteer &&
            processedData.volunteerNextShifts.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    Vos Prochains Créneaux (
                    {processedData.volunteerNextShifts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {processedData.volunteerNextShifts.map((shift) => (
                      <div
                        key={shift.id}
                        className="bg-pink-50 p-3 rounded-lg border-l-4 border-pink-500"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">
                            {shift.name}
                          </span>
                          <span className="font-bold text-pink-600 text-lg">
                            {getTimeUntilEvent(shift.start)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>
                            {new Date(shift.start).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>{shift.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Main Content - 2 Column Layout for better space usage */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left Column - Live & Schedule */}
        <div className="space-y-4">
          {/* Live Matches with more details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-red-500" />
                Matchs en Direct ({processedData.liveMatches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processedData.liveMatches.length > 0 ? (
                <div className="space-y-3">
                  {processedData.liveMatches.slice(0, 4).map((match) => (
                    <div
                      key={match.id}
                      className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm">
                          {match.team1.name} vs {match.team2.name}
                        </span>
                        <span className="font-bold text-red-600 text-lg">
                          {match.score_team1}-{match.score_team2}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          {sports?.find((s) => s.id === match.sport_id)?.name}
                        </span>
                        <span>
                          {
                            locations?.find((l) => l.id === match.location_id)
                              ?.name
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Aucun match en cours
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Today's Schedule with  info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Programme du Jour ({processedData.todaySchedule.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processedData.todaySchedule.length > 0 ? (
                <div className="space-y-2">
                  {processedData.todaySchedule
                    .slice(0, 6)
                    .map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-2 rounded hover:bg-gray-50"
                      >
                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium min-w-[50px] text-center">
                          {event.time}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.event}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.teams}
                          </p>
                          <p className="text-xs text-blue-600">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Aucun match programmé aujourd&apos;hui
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/*  Standings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Classement des Écoles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {globalPodium
              ?.sort((a, b) => a.total_points - b.total_points)
              .map((rank, index) => {
                const school = sportSchools?.find(
                  (school) => school.school_id === rank.school_id,
                );
                return (
                  <div
                    key={school?.school_id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                              ? "bg-gray-400"
                              : index === 2
                                ? "bg-orange-600"
                                : "bg-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">
                        {formatSchoolName(school?.school.name)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        {rank.total_points} pts
                      </p>
                    </div>
                  </div>
                );
              })
              .slice(0, 5)}
          </div>
        </CardContent>
      </Card>

      {/*  Action Buttons */}
      {/* <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <Button
              variant="outline"
              size="lg"
              className="h-16 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => router.push("/matches")}
            >
              <Trophy className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Matchs</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-16 flex-col gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
              onClick={() => router.push("/locations")}
            >
              <MapPin className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium">Lieux</span>
            </Button>

            {meCompetition?.is_volunteer ? (
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-col gap-2 hover:bg-pink-50 hover:border-pink-300 transition-colors"
                onClick={() => router.push("/volunteer-shifts")}
              >
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="text-sm font-medium">Bénévolat</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 transition-colors"
                onClick={() => router.push("/sports")}
              >
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Sports</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              className="h-16 flex-col gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
              onClick={() => router.push("/search")}
            >
              <SearchIcon className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Recherche</span>
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

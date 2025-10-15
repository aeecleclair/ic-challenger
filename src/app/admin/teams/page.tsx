"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { useSchoolSportTeams } from "@/src/hooks/useSchoolSportTeams";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import TeamCard from "@/src/components/admin/teams/TeamCard";
import { TeamsForm } from "@/src/components/admin/teams/TeamsForm";
import { WarningDialog } from "@/src/components/custom/WarningDialog";
import {
  Plus,
  Search,
  Trophy,
  Shield,
  Users,
  Filter,
  Table,
  Grid,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamFormSchema, TeamFormValues } from "@/src/forms/team";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { toast } from "@/src/components/ui/use-toast";

const TeamsDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sports } = useSports();
  const { schools } = useSchools();

  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);
  const [editTeamId, setEditTeamId] = useState<string | null>(null);
  const [selectedSportId, setSelectedSportId] = useState<string>(
    searchParams.get("sport_id") || "",
  );
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(
    searchParams.get("school_id") || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Function to update URL with current selections
  const updateURL = useCallback(
    (sportId: string, schoolId: string) => {
      const params = new URLSearchParams();
      if (sportId) params.set("sport_id", sportId);
      if (schoolId) params.set("school_id", schoolId);

      const query = params.toString();
      const newUrl = query ? `/admin/teams?${query}` : "/admin/teams";
      router.replace(newUrl);
    },
    [router],
  );

  // Enhanced setters that update URL
  const handleSportChange = (sportId: string) => {
    setSelectedSportId(sportId);
    // Reset school when sport changes, but not during initial load
    if (selectedSportId) {
      setSelectedSchoolId("");
      updateURL(sportId, "");
    } else {
      updateURL(sportId, selectedSchoolId);
    }
  };

  const handleSchoolChange = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    updateURL(selectedSportId, schoolId);
  };

  const {
    teams,
    refetchTeams,
    deleteSchoolSportTeam,
    createSchoolSportTeam,
    updateSchoolSportTeam,
    isLoading,
    isDeleteLoading,
    isCreateLoading,
    isUpdateLoading,
  } = useSchoolSportTeams({
    sportId: selectedSportId || undefined,
    schoolId: selectedSchoolId || undefined,
  });

  // Auto-select first sport when sports are loaded and no sport is selected
  useEffect(() => {
    if (sports && sports.length > 0 && !selectedSportId) {
      const firstSportId = sports[0].id;
      setSelectedSportId(firstSportId);
      updateURL(firstSportId, selectedSchoolId);
    }
  }, [sports, selectedSportId, selectedSchoolId, updateURL]);

  // Auto-select first school when schools are loaded and sport is selected but no school
  useEffect(() => {
    if (schools && schools.length > 0 && selectedSportId && !selectedSchoolId) {
      const firstSchoolId = schools[0].id;
      setSelectedSchoolId(firstSchoolId);
      updateURL(selectedSportId, firstSchoolId);
    }
  }, [schools, selectedSportId, selectedSchoolId, updateURL]);

  const filteredTeams = useMemo(() => {
    if (!teams) return [];

    return teams.filter((team) => {
      const matchesSearch = team.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [teams, searchQuery]);

  const stats = useMemo(() => {
    if (!teams) return { total: 0, withCaptain: 0, avgMembers: 0 };

    const withCaptain = teams.filter((t) => t.captain_id).length;
    const totalMembers = teams.reduce(
      (sum, t) => sum + (t.participants?.length || 0),
      0,
    );
    const avgMembers =
      teams.length > 0 ? Math.round(totalMembers / teams.length) : 0;

    return {
      total: teams.length,
      withCaptain,
      avgMembers,
    };
  }, [teams]);

  // Form for creating/editing teams
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      sport_id: selectedSportId,
      school_id: selectedSchoolId,
      captain_id: "",
    },
  });

  // Update form when sport/school selection changes
  useEffect(() => {
    if (selectedSportId && selectedSchoolId && !editTeamId) {
      form.setValue("sport_id", selectedSportId);
      form.setValue("school_id", selectedSchoolId);
    }
  }, [selectedSportId, selectedSchoolId, form, editTeamId]);

  // Get team being edited
  const editingTeam = useMemo(() => {
    if (!editTeamId || !teams) return null;
    return teams.find((t) => t.id === editTeamId) || null;
  }, [editTeamId, teams]);

  // Populate form when editing
  useEffect(() => {
    if (editingTeam) {
      form.reset({
        name: editingTeam.name,
        sport_id: editingTeam.sport_id,
        school_id: editingTeam.school_id,
        captain_id: editingTeam.captain_id || "",
      });
    }
  }, [editingTeam, form]);

  const handleCreateTeam = async (values: TeamFormValues) => {
    try {
      const teamData = {
        name: values.name,
        sport_id: values.sport_id,
        school_id: values.school_id,
        captain_id: values.captain_id,
      };

      createSchoolSportTeam(teamData, () => {
        setShowCreateForm(false);
        form.reset();
      });
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleUpdateTeam = async (values: TeamFormValues) => {
    if (!editTeamId) return;

    try {
      const teamData = {
        name: values.name,
        captain_id: values.captain_id || null,
      };

      updateSchoolSportTeam(editTeamId, teamData, () => {
        setEditTeamId(null);
        form.reset();
      });
    } catch (error) {
      console.error("Error updating team:", error);
    }
  };

  const handleDeleteTeam = () => {
    if (!deleteTeamId) return;

    try {
      deleteSchoolSportTeam(deleteTeamId, () => {
        setDeleteTeamId(null);
      });
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleEdit = (teamId: string) => {
    setEditTeamId(teamId);
  };

  const handleCloseDialog = () => {
    setShowCreateForm(false);
    setEditTeamId(null);
    form.reset();
  };

  if (!selectedSportId || !selectedSchoolId) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Gestion des Équipes
              </h1>
              <p className="text-muted-foreground">
                Gérez les équipes de votre compétition
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedSportId} onValueChange={handleSportChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sélectionnez un sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports?.map((sport) => (
                    <SelectItem key={sport.id} value={sport.id}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedSchoolId}
                onValueChange={handleSchoolChange}
                disabled={!selectedSportId}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sélectionnez une école" />
                </SelectTrigger>
                <SelectContent>
                  {schools?.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name ? formatSchoolName(school.name) : school.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-blue-600 text-lg font-medium mb-2">
            Sélection requise
          </p>
          <p className="text-blue-600">
            Veuillez sélectionner un sport et une école pour voir les équipes
            correspondantes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Gestion des Équipes
            </h1>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
            disabled={!selectedSportId || !selectedSchoolId}
          >
            <Plus className="h-4 w-4" />
            Nouvelle équipe
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une équipe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>

            <Select value={selectedSportId} onValueChange={handleSportChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionnez un sport" />
              </SelectTrigger>
              <SelectContent>
                {sports?.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSchoolId}
              onValueChange={handleSchoolChange}
              disabled={!selectedSportId}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionnez une école" />
              </SelectTrigger>
              <SelectContent>
                {schools?.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name ? formatSchoolName(school.name) : school.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => handleEdit(team.id)}
              onDelete={() => setDeleteTeamId(team.id)}
            />
          ))}
          {filteredTeams.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune équipe trouvée</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateForm || !!editTeamId}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editTeamId
                ? "Modifier l&apos;équipe"
                : "Créer une nouvelle équipe"}
            </DialogTitle>
          </DialogHeader>
          <TeamsForm
            form={form}
            onSubmit={editTeamId ? handleUpdateTeam : handleCreateTeam}
            isLoading={editTeamId ? isUpdateLoading : isCreateLoading}
            submitLabel={editTeamId ? "Mettre à jour" : "Créer"}
            isEditing={!!editTeamId}
            initialData={
              editingTeam
                ? {
                    name: editingTeam.name,
                    sport_id: editingTeam.sport_id,
                    school_id: editingTeam.school_id,
                    captain_id: editingTeam.captain_id || undefined,
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <WarningDialog
        isOpened={!!deleteTeamId}
        setIsOpened={(value: boolean) => {
          if (!value) setDeleteTeamId(null);
        }}
        isLoading={isDeleteLoading}
        title="Supprimer l'équipe"
        description="Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action est irréversible."
        validateLabel="Supprimer"
        callback={handleDeleteTeam}
      />
    </div>
  );
};

export default TeamsDashboard;

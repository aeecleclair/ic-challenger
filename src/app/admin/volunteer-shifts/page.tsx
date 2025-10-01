"use client";

import { Plus, Search, Eye, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { LoadingButton } from "../../../components/custom/LoadingButton";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  VolunteerShiftCard,
  VolunteerShiftDetail,
  VolunteerShiftForm,
  VolunteerShiftCalendar,
} from "../../../components/admin/volunteer-shifts";
import { VolunteerShift } from "../../../api/hyperionSchemas";

export default function VolunteerShiftsPage() {
  const { volunteerShifts, isLoading, refetchVolunteerShifts } =
    useVolunteerShifts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<string | null>(null);

  // Filter and search logic
  const filteredShifts = useMemo(() => {
    if (!volunteerShifts) return [];

    return volunteerShifts.filter((shift: VolunteerShift) => {
      const matchesSearch =
        shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === "" ||
        shift.location?.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesDate =
        dateFilter === "" ||
        format(new Date(shift.start_time), "yyyy-MM-dd") === dateFilter;

      return matchesSearch && matchesLocation && matchesDate;
    });
  }, [volunteerShifts, searchTerm, selectedLocation, dateFilter]);

  // Statistics
  const stats = useMemo(() => {
    if (!volunteerShifts)
      return { total: 0, upcoming: 0, totalValue: 0, locations: 0 };

    const now = new Date();
    const upcoming = volunteerShifts.filter(
      (shift: VolunteerShift) => new Date(shift.start_time) > now,
    ).length;
    const totalValue = volunteerShifts.reduce(
      (sum: number, shift: VolunteerShift) => sum + shift.value,
      0,
    );
    const uniqueLocations = new Set(
      volunteerShifts
        .map((shift: VolunteerShift) => shift.location)
        .filter(Boolean),
    );

    return {
      total: volunteerShifts.length,
      upcoming,
      totalValue,
      locations: uniqueLocations.size,
    };
  }, [volunteerShifts]);

  // Unique locations for filter
  const locations = useMemo(() => {
    if (!volunteerShifts) return [];
    const uniqueLocations = Array.from(
      new Set(
        volunteerShifts
          .map((shift: VolunteerShift) => shift.location)
          .filter(Boolean),
      ),
    );
    return uniqueLocations;
  }, [volunteerShifts]);

  const handleCreateShift = () => {
    setEditingShift(null);
    setIsFormOpen(true);
  };

  const handleEditShift = (shiftId: string) => {
    setEditingShift(shiftId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingShift(null);
  };

  const handleCloseDetail = () => {
    setSelectedShift(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingButton isLoading={true}>Chargement...</LoadingButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Créneaux Bénévoles
          </h1>
          <p className="text-muted-foreground">
            Gérez les créneaux de bénévolat pour l&apos;événement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Eye className="h-4 w-4" />
            Grille
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <Calendar className="h-4 w-4" />
            Calendrier
          </Button>
          <Button onClick={handleCreateShift}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Créneau
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Créneaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Créneaux à Venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalValue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lieux Uniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.locations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      {viewMode === "grid" && (
        <Card>
          <CardHeader>
            <CardTitle>Filtres et Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Lieu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les lieux</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location!}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDateFilter(e.target.value)
                }
                className="w-[150px]"
              />
              {(searchTerm || selectedLocation || dateFilter) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedLocation("");
                    setDateFilter("");
                  }}
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShifts.map((shift) => (
            <VolunteerShiftCard
              key={shift.id}
              shift={shift}
              onEdit={() => handleEditShift(shift.id)}
              onView={() => setSelectedShift(shift.id)}
            />
          ))}
          {filteredShifts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <p className="text-lg font-medium text-muted-foreground">
                Aucun créneau trouvé
              </p>
              <p className="text-sm text-muted-foreground">
                Ajustez vos filtres ou créez un nouveau créneau
              </p>
            </div>
          )}
        </div>
      ) : (
        <VolunteerShiftCalendar
          shifts={filteredShifts}
          onShiftClick={(shift: VolunteerShift) => setSelectedShift(shift.id)}
          onCreateShift={handleCreateShift}
        />
      )}

      {/* Detail Modal */}
      {selectedShift && (
        <VolunteerShiftDetail
          shiftId={selectedShift}
          onClose={handleCloseDetail}
          onEdit={() => {
            handleEditShift(selectedShift);
            setSelectedShift(null);
          }}
        />
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <VolunteerShiftForm
          shiftId={editingShift}
          onClose={handleCloseForm}
          onSuccess={() => {
            refetchVolunteerShifts();
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
}

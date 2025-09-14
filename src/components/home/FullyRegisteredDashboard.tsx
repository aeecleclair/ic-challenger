import { UserStatusBadges } from "./UserStatusBadges";

interface FullyRegisteredDashboardProps {
  edition: {
    year: number;
    name: string;
    start_date: string;
    end_date: string;
    active?: boolean;
    inscription_enabled?: boolean;
  };
  meCompetition: {
    is_athlete?: boolean;
    is_volunteer?: boolean;
    is_pompom?: boolean;
    is_fanfare?: boolean;
    is_cameraman?: boolean;
  };
}

export const FullyRegisteredDashboard = ({
  edition,
  meCompetition,
}: FullyRegisteredDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">
          Édition {edition.year} - {edition.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Du {new Date(edition.start_date).toLocaleDateString("fr-FR")} au{" "}
          {new Date(edition.end_date).toLocaleDateString("fr-FR")}
        </p>
      </div>

      <UserStatusBadges meCompetition={meCompetition} />

      {/* Edition Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium">Statut de l&apos;édition</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {edition.active ? "Édition active" : "Édition inactive"}
          </p>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium">Inscriptions</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {edition.inscription_enabled ? "Ouvertes" : "Fermées"}
          </p>
        </div>
      </div>
    </div>
  );
};

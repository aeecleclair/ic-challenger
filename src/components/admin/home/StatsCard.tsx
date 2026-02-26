import { useStats } from "@/src/hooks/useStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

const methodToLabel: Record<string, string> = {
  manual: "Manuel",
  helloasso: "HelloAsso",
};

export const StatsCard = () => {
  const { stats } = useStats();
  return (
    stats && (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques de l&apos;édition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-sm flex flex-col gap-2">
              <h2 className="text-lg font-semibold mb-2">Utilisateurs</h2>
              <p>
                Nombre total d&apos;utilisateurs :{" "}
                {stats.users_stats.total_users}
              </p>
              <p>
                Nombre total d&apos;athlètes :{" "}
                {stats.users_stats.total_athletes}
              </p>
              <p>
                Nombre total de de caméramans :{" "}
                {stats.users_stats.total_cameramen}
              </p>
              <p>Nombre total de pompoms : {stats.users_stats.total_pompoms}</p>
              <p>
                Nombre total de fanfarons : {stats.users_stats.total_fanfares}
              </p>
              <p>
                Nombre total de bénévoles : {stats.users_stats.total_volunteers}
              </p>
            </div>
            <div className="text-sm flex flex-col gap-2">
              <h2 className="text-lg font-semibold mb-2">Sports</h2>
              <p>
                Nombre de participants : {stats.sports_stats.total_participants}
              </p>
              <p>Nombre d&apos;équipes : {stats.sports_stats.total_teams}</p>
              <p>Nombre de matchs : {stats.sports_stats.total_matches}</p>
            </div>
            <div className="text-sm flex flex-col gap-2">
              <h2 className="text-lg font-semibold mb-2">Revenus</h2>
              <p>
                Total :{" "}
                {stats.revenues_stats.reduce(
                  (sum, revenue) => sum + revenue.total,
                  0,
                ) / 100}{" "}
                €
              </p>
              {stats.revenues_stats.map((revenue) => (
                <p key={revenue.method}>
                  Revenus {methodToLabel[revenue.method]} :{" "}
                  {revenue.total / 100} € ({revenue.count} transactions)
                </p>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
};

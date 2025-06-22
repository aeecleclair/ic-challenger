"use client";

import SportCard from "@/src/components/admin/appSideBar/sports/SportCard";
import { useSports } from "@/src/hooks/useSports";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import SportDetail from "@/src/components/admin/appSideBar/sports/SportDetail";

const Dashboard = () => {
  const router = useRouter();
  const { sports } = useSports();

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("sport_id");

  const sport = sports?.find((s) => s.id === schoolId);
  return (
    <div className="flex w-full flex-col p-6">
      {sport ? (
        <SportDetail sport={sport} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sports enregistrés</h1>
            <Link href="/admin/sports/create">
              <Button>Ajouter un sport</Button>
            </Link>
          </div>
          <>
            {sports && sports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sports.map((sport) => (
                  <SportCard
                    key={sport.id}
                    sport={sport}
                    onClick={() => {
                      router.push(`/admin/sports?sport_id=${sport.id}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full mt-10">
                <p className="text-gray-500">Aucun sport activé</p>
              </div>
            )}
          </>
        </>
      )}
    </div>
  );
};

export default Dashboard;

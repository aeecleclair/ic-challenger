"use client";

import SchoolCard from "@/src/components/admin/appSideBar/schools/SchoolCard";
import { Button } from "@/src/components/ui/button";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SchoolDetail from "@/src/components/admin/appSideBar/schools/SchoolDetail";

const Dashboard = () => {
  const router = useRouter();
  const { schools } = useSchools();
  const { sportSchools } = useSportSchools();

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  const school = sportSchools?.find((s) => s.school_id === schoolId);

  return (
    <div className="flex w-full flex-col p-6">
      {school ? (
        <SchoolDetail school={school} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Écoles enregistrés</h1>
            <Link href="/admin/schools/create">
              <Button>Ajouter une école</Button>
            </Link>
          </div>
          {sportSchools && sportSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {sportSchools.map((school) => (
                <SchoolCard
                  key={school.school_id}
                  school={school}
                  onClick={() => {
                    router.push(`/admin/schools?school_id=${school.school_id}`);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full mt-10">
              <p className="text-gray-500">Aucune école enregistré</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;

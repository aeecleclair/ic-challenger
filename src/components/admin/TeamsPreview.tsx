import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { TeamPreview } from "@/src/api/hyperionSchemas";
import { useRouter, useSearchParams } from "next/navigation";
import { ProgressBadge } from "../custom/ProgressBadge";

interface TeamsPreviewProps {
  teams?: TeamPreview[];
  isLoading: boolean;
}

export const TeamsPreview = ({ teams, isLoading }: TeamsPreviewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onTeamClick(teamId: string) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("teamId", teamId);
    const query = current.toString();
    router.replace(`/admin/teams?${query}`);
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Equipes</CardTitle>
          <CardDescription>
            Aperçu des {teams?.slice(0, 5).length ?? 0} équipes les plus proches
            de la validation de leur dossier
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/admin/teams">
            Voir tout
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="max-md:hidden">Capitaine</TableHead>
              <TableHead className="max-md:hidden">Coéquipier</TableHead>
              <TableHead className="max-md:hidden">Documents</TableHead>
              <TableHead className="text-right">Inscription</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-[78px]">
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    {[...Array(3)].map((_, index) => (
                      <TableCell key={index} className="max-md:hidden">
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton className="h-6 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {teams && (
              <>
                {teams
                  .toSorted(
                    (a, b) =>
                      (b.validation_progress % 100) -
                      (a.validation_progress % 100),
                  )
                  .slice(0, 5)
                  .map((team) => {
                    const number_of_validated_document =
                      team.captain.number_of_validated_document +
                      (team.second?.number_of_validated_document ?? 0);
                    const number_of_document =
                      team.captain.number_of_document +
                      (team.second?.number_of_document ?? 0);
                    return (
                      <TableRow
                        key={team.id}
                        onClick={() => onTeamClick(team.id)}
                      >
                        <TableCell className="h-[78px]">{team.name}</TableCell>
                        <TableCell className="max-md:hidden">
                          <div className="font-medium">
                            {team.captain?.firstname} {team.captain?.name}
                          </div>
                        </TableCell>
                        <TableCell className="max-md:hidden">
                          {team.second ? (
                            <>
                              <div className="font-medium">
                                {team.second.firstname} {team.second.name}
                              </div>
                            </>
                          ) : (
                            <div className="font-medium text-muted-foreground">
                              Non renseigné
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-md:hidden">
                          <ProgressBadge
                            progress={number_of_validated_document}
                            total={number_of_document}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {team?.validation_progress.toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

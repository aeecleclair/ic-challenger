"use client";

import {
  CompetitionUser,
  ParticipantComplete,
} from "@/src/api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Trophy } from "lucide-react";
import { Badge } from "../../ui/badge";
import { useSports } from "@/src/hooks/useSports";

export const UserCompetition = ({
  user,
  userParticipant,
}: {
  user: CompetitionUser;
  userParticipant: ParticipantComplete | undefined;
}) => {
  const { sports } = useSports();
  const getParticipantType = (user: CompetitionUser) => {
    const types = [];
    if (user.is_athlete) types.push("Athlète");
    if (user.is_pompom) types.push("Pompom");
    if (user.is_fanfare) types.push("Fanfare");
    if (user.is_cameraman) types.push("Cameraman");
    // Handle volunteer - either explicit or no other roles
    if (
      !user.is_athlete &&
      !user.is_pompom &&
      !user.is_fanfare &&
      !user.is_cameraman
    ) {
      types.push("Bénévole");
    }
    return types;
  };

  const participantTypes = getParticipantType(user);
  const userSport =
    sports && userParticipant
      ? sports.find((s) => s.id === userParticipant.sport_id)
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Compétition et participant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Informations de compétition</h3>
            <div className="space-y-3">
              {participantTypes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type de participant
                  </p>
                  {participantTypes.map((type, index) => {
                    let badgeClass = "";
                    switch (type) {
                      case "Athlète":
                        badgeClass =
                          "bg-blue-100 text-blue-800 hover:bg-blue-200";
                        break;
                      case "Pompom":
                        badgeClass =
                          "bg-pink-100 text-pink-800 hover:bg-pink-200";
                        break;
                      case "Fanfare":
                        badgeClass =
                          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
                        break;
                      case "Cameraman":
                        badgeClass =
                          "bg-purple-100 text-purple-800 hover:bg-purple-200";
                        break;
                      case "Bénévole":
                        badgeClass =
                          "bg-green-100 text-green-800 hover:bg-green-200";
                        break;
                      default:
                        badgeClass = "";
                    }
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={badgeClass}
                      >
                        {type}
                      </Badge>
                    );
                  })}
                </div>
              )}
              {user.sport_category && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Catégorie sportive
                  </p>
                  <p className="text-sm">{user.sport_category}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Autorisation de diffusion de photos
                </p>
                {user.allow_pictures ? (
                  <Badge
                    variant="secondary"
                    className={"bg-green-100 text-green-800 hover:bg-green-200"}
                  >
                    Oui
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className={"bg-red-100 text-red-800 hover:bg-red-200"}
                  >
                    Non
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Validation de l&apos;école
                </p>
                {user.validated ? (
                  <Badge
                    variant="secondary"
                    className={"bg-green-100 text-green-800 hover:bg-green-200"}
                  >
                    Validé
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className={"bg-red-100 text-red-800 hover:bg-red-200"}
                  >
                    Non validé
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {userParticipant && (
            <div>
              <h3 className="font-semibold mb-3">Informations de sportif</h3>
              <div className="space-y-3">
                {userSport && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Sport
                    </p>
                    <p className="text-sm">{userSport.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Équipe
                  </p>
                  <p className="text-sm">
                    {userParticipant.team.name}
                    {userParticipant.substitute ? " (Remplaçant)" : ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    License
                  </p>
                  {userParticipant.is_license_valid ? (
                    <Badge
                      variant="secondary"
                      className={
                        "bg-green-100 text-green-800 hover:bg-green-200"
                      }
                    >
                      Validée
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className={"bg-red-100 text-red-800 hover:bg-red-200"}
                    >
                      Non validée
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

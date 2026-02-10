"use client";

import { CompetitionUser } from "@/src/api/hyperionSchemas";
import { ArrowLeft, Badge, Mail, School, User, Users } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSportSchools } from "@/src/hooks/useSportSchools";

export const UserInfo = ({ user }: { user: CompetitionUser }) => {
  const { sportSchools } = useSportSchools();

  const userSchool = sportSchools
    ? sportSchools.find((ss) => ss.school_id === user.user.school_id)
    : undefined;
  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Additional Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                {user.user.name && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nom
                    </p>
                    <p className="text-sm">{user.user.name}</p>
                  </div>
                )}
                {user.user.firstname && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Prénom
                    </p>
                    <p className="text-sm">{user.user.firstname}</p>
                  </div>
                )}
                {userSchool && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      École
                    </p>
                    <p className="text-sm">
                      {formatSchoolName(userSchool.school.name)}
                    </p>
                  </div>
                )}
                {user.user.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{user.user.email}</p>
                  </div>
                )}
                {user.user.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Téléphone
                    </p>
                    <p className="text-sm">{user.user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

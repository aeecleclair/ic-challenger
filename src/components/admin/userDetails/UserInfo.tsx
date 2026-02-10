import { CompetitionUser } from "@/src/api/hyperionSchemas";
import { ArrowLeft, Badge, Mail, School, User, Users } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

export const UserInfo = ({ user }: { user: CompetitionUser }) => {
  const userName =
    user.user.firstname || user.user.name
      ? `${user.user.firstname || ""} ${user.user.name || ""}`.trim()
      : "Utilisateur";

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            {userName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nom complet
                </p>
                <p className="text-2xl font-bold text-blue-600">{userName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.user.email && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg font-bold text-green-600 truncate">
                    {user.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  École
                </p>
                <p className="text-lg font-bold text-purple-600 font-mono">
                  {formatSchoolName(user.user.school?.name)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Informations personnelles</h3>
              <div className="space-y-3">
                {user.user.firstname && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Prénom
                    </p>
                    <p className="text-sm">{user.user.firstname}</p>
                  </div>
                )}
                {user.user.name && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nom
                    </p>
                    <p className="text-sm">{user.user.name}</p>
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

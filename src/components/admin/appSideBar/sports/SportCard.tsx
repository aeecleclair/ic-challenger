"use client";

import { Sport } from "@/src/api/hyperionSchemas";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { sportCategories } from "@/src/forms/sport";
import Link from "next/link";

interface SportCardProps {
  sport: Sport;
  onClick?: () => void;
}

export const SportCard = ({ sport, onClick }: SportCardProps) => {
  // Find the label for the sport category
  const categoryLabel =
    sportCategories.find((cat) => cat.value === sport.sport_category)?.label ||
    sport.sport_category;
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{sport.name}</CardTitle>
        <div className="flex space-x-2 items-center">
          {sport.sport_category && (
            <Badge variant="secondary">{categoryLabel}</Badge>
          )}
          <Badge variant={sport.activated ? "default" : "outline"}>
            {sport.activated ? "Activé" : "Désactivé"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Taille d&apos;équipe: {sport.team_size}</p>
          {sport.substitute_max !== undefined &&
            sport.substitute_max !== null && (
              <p>Remplaçants max: {sport.substitute_max}</p>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/admin/sports/${sport.id}`}
          className="text-sm text-primary hover:underline"
          onClick={(e) => {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
          }}
        >
          Voir les détails
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SportCard;

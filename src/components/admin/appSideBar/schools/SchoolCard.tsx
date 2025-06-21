"use client";

import { SchoolExtension } from "@/src/api/hyperionSchemas";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import Link from "next/link";

interface SchoolCardProps {
  school: SchoolExtension;
  onClick?: () => void;
}

export const SchoolCard = ({
  school,
  onClick,
}: SchoolCardProps) => {
  const formattedName = formatSchoolName(school.school.name);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{formattedName}</CardTitle>
        <div className="flex space-x-2 items-center">
          <Badge variant="secondary">
            {school.from_lyon ? "Lyonnaise" : "Externe"}
          </Badge>
          <Badge variant={school.activated ? "default" : "outline"}>
            {school.activated ? "Activée" : "Désactivée"}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <Link
          href={`/admin/schools/${school.school_id}`}
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

export default SchoolCard;

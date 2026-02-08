import { Card } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useEdition } from "@/src/hooks/useEdition";
import { toast } from "../../ui/use-toast";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { DropdownMenu } from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

export const SchoolQuotasExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const { sportSchools } = useSportSchools();
  const [schoolId, setSchoolId] = useState("");

  const exportResult = async () => {
    if (!schoolId) {
      toast({
        description: "Veuillez sélectionner une école",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/schools/${schoolId}/quotas`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Error while downloading");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `export_data_${edition?.name}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        description: (error as { detail: String }).detail,
        variant: "destructive",
      });
      return;
    }
  };
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Export des quotas par école</h2>
      <div className="grid gap-6 mt-4">
        <Select value={schoolId} onValueChange={(value) => setSchoolId(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sélectionnez une école" />
          </SelectTrigger>
          <SelectContent>
            {sportSchools?.map((school) => (
              <SelectItem key={school.school_id} value={school.school_id}>
                {school.school.name
                  ? formatSchoolName(school.school.name)
                  : school.school_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="w-[100px]" type="button" onClick={exportResult}>
          Exporter
        </Button>
      </div>
    </Card>
  );
};

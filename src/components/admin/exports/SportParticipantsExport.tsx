import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useEdition } from "@/src/hooks/useEdition";
import { toast } from "../../ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useSports } from "@/src/hooks/useSports";

export const SportParticipantsExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const { sports } = useSports();
  const [sportId, setSportId] = useState("");

  const activeSports = sports?.filter((sport) => sport.active);

  const exportResult = async () => {
    if (!sportId) {
      toast({
        description: "Veuillez sélectionner un sport",
        variant: "destructive",
      });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/sports/${sportId}/participants`,
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
      <h2 className="text-2xl font-bold mb-4">
        Export des participants par sport
      </h2>
      <div className="grid gap-6 mt-4">
        <Select value={sportId} onValueChange={(value) => setSportId(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sélectionnez une école" />
          </SelectTrigger>
          <SelectContent>
            {activeSports?.map((sport) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.name}
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

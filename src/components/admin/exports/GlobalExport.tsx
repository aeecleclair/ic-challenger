import { Card } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useEdition } from "@/src/hooks/useEdition";
import { toast } from "../../ui/use-toast";

export const GlobalExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const [exportParams, setExportParams] = useState<{
    excludeNonValidated: boolean;
    participants: boolean;
    purchases: boolean;
    payments: boolean;
  }>({
    excludeNonValidated: false,
    participants: true,
    purchases: true,
    payments: true,
  });

  const exportResult = async () => {
    let params = "";
    if (exportParams.excludeNonValidated) {
      params += `exclude_non_validated=true&`;
    }
    if (exportParams.participants) {
      params += `included_fields=participants&`;
    }
    if (exportParams.purchases) {
      params += `included_fields=purchases&`;
    }
    if (exportParams.payments) {
      params += `included_fields=payments&`;
    }
    if (params.endsWith("&")) {
      params = params.slice(0, -1);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/users${params ? "?" + params : ""}`,
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
      <h2 className="text-2xl font-bold mb-4">Export complet</h2>
      <div className="grid gap-6 mt-4">
        <div className="grid gap-4">
          <div className="flex items-center space-x-2  ">
            <Checkbox
              id="exclude_non_validated"
              checked={exportParams.excludeNonValidated}
              onCheckedChange={(value) =>
                setExportParams({
                  ...exportParams,
                  excludeNonValidated: value as boolean,
                })
              }
            />
            <Label htmlFor="exclude_non_validated">
              Exclure les inscrits non validés
            </Label>
          </div>
          <div className="flex items-center space-x-2  ">
            <Checkbox
              id="participants"
              checked={exportParams.participants}
              onCheckedChange={(value) =>
                setExportParams({
                  ...exportParams,
                  participants: value as boolean,
                })
              }
            />
            <Label htmlFor="participants">Inscriptions</Label>
          </div>
          <div className="flex items-center space-x-2  ">
            <Checkbox
              id="purchases"
              checked={exportParams.purchases}
              onCheckedChange={(value) =>
                setExportParams({
                  ...exportParams,
                  purchases: value as boolean,
                })
              }
            />
            <Label htmlFor="purchases">Achats</Label>
          </div>
          <div className="flex items-center space-x-2  ">
            <Checkbox
              id="payments"
              checked={exportParams.payments}
              onCheckedChange={(value) =>
                setExportParams({
                  ...exportParams,
                  payments: value as boolean,
                })
              }
            />
            <Label htmlFor="payments">Paiements</Label>
          </div>
        </div>
        <Button className="w-[100px]" type="button" onClick={exportResult}>
          Exporter
        </Button>
      </div>
    </Card>
  );
};

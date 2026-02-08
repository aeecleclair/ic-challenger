import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { useEdition } from "@/src/hooks/useEdition";
import { toast } from "../../ui/use-toast";

export const CaptainsExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();

  const exportResult = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/participants/captains`,
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
      <h2 className="text-2xl font-bold mb-4">Export des capitaines</h2>
      <div className="grid gap-6 mt-4">
        <Button className="w-[100px]" type="button" onClick={exportResult}>
          Exporter
        </Button>
      </div>
    </Card>
  );
};

import { useDocument } from "@/src/hooks/useDocument";
import { useInformation } from "@/src/hooks/useInformation";
import { useState } from "react";
import { StatusDialog } from "../custom/StatusDialog";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { LoadingButton } from "../custom/LoadingButton";

interface RegisteringCompleteDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

export const RegisteringCompleteDialog = ({
  isOpened,
  setIsOpened,
}: RegisteringCompleteDialogProps) => {
  const [isFileLoading, setIsFileLoading] = useState(false);
  const { information } = useInformation();
  const { refetch, setDocumentId } = useDocument();
  const router = useRouter();

  function downloadRaidInformation(documentId: string) {
    setIsFileLoading(true);
    setDocumentId(documentId);
    refetch().then((response) => {
      const data = response.data;
      if (!data) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le fichier",
          variant: "destructive",
        });
        setIsFileLoading(false);
        return;
      }
      const extension = data.type.split("/")[1];
      const name = `Réglement_du_raid.${extension}`;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      setIsFileLoading(false);
      link.click();
    });
  }
  return (
    information && (
      <StatusDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        title="Inscription complète"
        description={
          <div className="space-y-2">
            <div>Votre inscription est complète.</div>
            <div>
              Vous trouverez toutes les informations nécessaires dans le
              document à télécharger ci-dessous.
            </div>
            <div>Bonne préparation et à très bientôt !</div>
            <LoadingButton
              className="w-full mt-6"
              variant="outline"
              onClick={(_) =>
                downloadRaidInformation(information.raid_information_id!)
              }
              isLoading={isFileLoading}
              label="Télécharger le document"
            />
          </div>
        }
        status="SUCCESS"
        callback={() => {
          setIsOpened(false);
          router.replace("/");
        }}
      />
    )
  );
};

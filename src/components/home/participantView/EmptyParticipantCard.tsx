import { Card, CardContent } from "../../ui/card";

import { HiPlus } from "react-icons/hi";
import { toast } from "../../ui/use-toast";
import { useInviteToken } from "@/src/hooks/useInviteToken";
import { Team } from "@/src/api/hyperionSchemas";
import { useState } from "react";
import { LoadingButton } from "../../custom/LoadingButton";

interface EmptyParticipantCardProps {
  team?: Team;
}

export const EmptyParticipantCard = ({ team }: EmptyParticipantCardProps) => {
  const { createInviteToken, isCreationLoading } = useInviteToken();
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  function createInviteLink() {
    if (team === undefined) {
      return;
    }
    createInviteToken(team.id, async (token) => {
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
      const inviteLink = `${frontendUrl}?invite=${token.token}`;
      setInvitationLink(inviteLink);
      try {
        await navigator.clipboard.writeText(inviteLink);
        toast({
          title: "Invitation envoyée",
          description: `Le lien d'invitation a été copié dans le presse-papier.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de copier le lien d'invitation dans le presse-papier.`,
        });
      }
    });
  }
  return (
    <Card className="w-full">
      <CardContent className="w-full h-full">
        <div className="flex m-auto h-full mt-3 flex-col">
          <div className="flex m-auto flex-col items-center">
            <LoadingButton
              isLoading={isCreationLoading}
              onClick={createInviteLink}
              label={
                <>
                  <HiPlus className="inline mr-4" />
                  <span>Inviter un participant</span>
                </>
              }
              className="w-[200px]"
              variant="outline"
            />
            {invitationLink && (
              <span className="text-sm text-muted-foreground mt-4">
                {invitationLink}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

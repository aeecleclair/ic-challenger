import { Participant } from "@/src/api/hyperionSchemas";
import { ParticipantInfo } from "../../../custom/ParticipantInfo";
import { getSituationLabel, getSituationTitle } from "@/src/infra/teamUtils";
import { getLabelFromValue, situations } from "@/src/infra/comboboxValues";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatDate } from "@/src/utils/dateFormat";

interface ParticipantInfoTabProps {
  participant: Participant;
}

export const ParticipantInfoTab = ({
  participant,
}: ParticipantInfoTabProps) => {
  function getSituation(participant: Participant) {
    const situation = getSituationLabel(participant.situation ?? undefined);
    const title = getSituationTitle(participant.situation ?? undefined);
    return (
      <>
        <ParticipantInfo
          label="Situation"
          value={getLabelFromValue(situations, situation)}
        />
        {situation === "otherschool" && (
          <ParticipantInfo label="Nom de l'école" value={title} />
        )}
        {situation === "corporatepartner" && (
          <ParticipantInfo label="Nom de l'entreprise" value={title} />
        )}
        {situation === "other" && (
          <ParticipantInfo label="Autre situation" value={title} />
        )}
      </>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{participant.firstname + " " + participant.name}</CardTitle>
        <CardDescription>
          dossier particiant completé à{" "}
          {participant.validation_progress.toFixed(0)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ParticipantInfo
          label="Date de naissance"
          value={formatDate(participant.birthday)}
        />
        <ParticipantInfo label="Email" value={participant.email} />
        <ParticipantInfo label="Adresse" value={participant.address} />
        <ParticipantInfo label="Taille de vélo" value={participant.bike_size} />
        <ParticipantInfo
          label="Taille de t-shirt"
          value={participant.t_shirt_size}
        />
        <ParticipantInfo label="Régime alimentaire" value={participant.diet} />
        {getSituation(participant)}
        <ParticipantInfo
          label="Attestation sur l'honneur"
          value={participant.attestation_on_honour}
        />
      </CardContent>
    </Card>
  );
};

import { useRouter } from "next/navigation";

interface EditionWaitingCardProps {
  edition: {
    year: number;
    name: string;
    start_date: string;
  };
}

export const EditionWaitingCard = ({ edition }: EditionWaitingCardProps) => {
  const router = useRouter();
  return (
    <div className="px-4 justify-center items-center flex h-full flex-col space-y-4">
      <h2 className="text-xl font-semibold">
        Édition {edition.year} - {edition.name}
      </h2>
      <p className="text-sm text-muted-foreground text-center">
        L&apos;édition débutera le{" "}
        {new Date(edition.start_date).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-sm text-muted-foreground">
        Veuillez patienter ou{" "}
        <span
          className="text-primary underline cursor-pointer hover:text-primary/80 transition-colors"
          onClick={() => {
            router.push("/register");
          }}
        >
          finaliser votre inscription
        </span>
        .
      </p>
    </div>
  );
};

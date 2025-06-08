"use client";

import { TopBar } from "@/src/components/admin/TopBar";
import { ContactMail } from "@/src/components/admin/information/ContactMail";
import { DriveFolder } from "@/src/components/admin/information/DriveFolder";
import { EmergencyPerson } from "@/src/components/admin/information/EmergencyPersons";
import { InscriptionEnd } from "@/src/components/admin/information/InscriptionEnd";
import { RaidDate } from "@/src/components/admin/information/RaidDate";
import { RaidInformationDocument } from "@/src/components/admin/information/RaidInformationDocument";
import { RaidPrice } from "@/src/components/admin/information/RaidPrice";
import { RaidRules } from "@/src/components/admin/information/RaidRules";
import { TShirtPrice } from "@/src/components/admin/information/TShirtPrice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useInformation } from "@/src/hooks/useInformation";
import { useUser } from "@/src/hooks/useUser";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { PaymentLink } from "@/src/components/admin/information/PayementLink";

const InformationPage = () => {
  const { isAdmin } = useUser();
  const router = useRouter();
  const { information } = useInformation();

  if (!isAdmin() && typeof window !== "undefined") {
    const redirectUrl = new URL(window.location.href);
    const path = redirectUrl.pathname + redirectUrl.search;
    router.replace(`/?redirect=${path}`);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <TopBar />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={["date", "price", "contact", "files"]}
            >
              <AccordionItem value="date">
                <AccordionTrigger>Dates</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    <InscriptionEnd />
                    <RaidDate />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>Prix</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    {/* <RaidPrice />
                    <TShirtPrice /> */}
                    <PaymentLink />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="contact">
                <AccordionTrigger>Contact</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    <ContactMail />
                    <EmergencyPerson />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="files">
                <AccordionTrigger>Fichiers</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    <DriveFolder />
                    {information && <RaidRules information={information} />}
                    {information && (
                      <RaidInformationDocument information={information} />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InformationPage;

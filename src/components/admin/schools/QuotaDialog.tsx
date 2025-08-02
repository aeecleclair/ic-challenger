import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sport } from "@/src/api/hyperionSchemas";
import { QuotaFormValues, quotaFormSchema } from "@/src/forms/quota";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { Form } from "@/src/components/ui/form";
import { FormItem, FormLabel } from "@/src/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Plus } from "lucide-react";

interface QuotaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: QuotaFormValues) => void;
  sports?: Sport[];
  selectedSport: string | null;
  setSelectedSport: (sportId: string | null) => void;
  existingQuotas?: { sport_id: string }[];
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
}

export function QuotaDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  sports,
  selectedSport,
  setSelectedSport,
  existingQuotas,
  title,
  description,
  submitLabel,
  isLoading,
}: QuotaDialogProps) {
  const quotaForm = useForm<QuotaFormValues>({
    resolver: zodResolver(quotaFormSchema),
    defaultValues: {
      participant_quota: 0,
      team_quota: 0,
    },
  });

  const handleCancel = () => {
    onOpenChange(false);
    quotaForm.reset();
    setSelectedSport(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un quota
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...quotaForm}>
          <form
            onSubmit={quotaForm.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {selectedSport ? (
              <FormItem className="w-full">
                <FormLabel>Sport</FormLabel>
                <div className="p-2 border rounded-md bg-muted/50">
                  {sports?.find((sport) => sport.id === selectedSport)?.name ||
                    selectedSport}
                </div>
              </FormItem>
            ) : (
              <FormItem className="w-full">
                <FormLabel>Sport</FormLabel>
                <Select
                  value={selectedSport || ""}
                  onValueChange={(value) => setSelectedSport(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sports?.map((sport) => {
                      const hasQuota = existingQuotas?.some(
                        (q) => q.sport_id === sport.id,
                      );
                      if (!hasQuota) {
                        return (
                          <SelectItem key={sport.id} value={sport.id}>
                            {sport.name}
                          </SelectItem>
                        );
                      }
                      return null;
                    })}
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            <StyledFormField
              form={quotaForm}
              label="Quota de participants"
              id="participant_quota"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              )}
            />

            <StyledFormField
              form={quotaForm}
              label="Quota d'équipes"
              id="team_quota"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {submitLabel}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

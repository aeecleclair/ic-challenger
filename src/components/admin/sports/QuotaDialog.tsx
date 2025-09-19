import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CoreSchool, SchoolSportQuota } from "@/src/api/hyperionSchemas";
import { SportQuotaFormValues, sportQuotaFormSchema } from "@/src/forms/sportQuota";
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
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useEffect } from "react";

interface QuotaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SportQuotaFormValues) => void;
  schools?: CoreSchool[];
  selectedSchool: string | null;
  setSelectedSchool: (schoolId: string | null) => void;
  existingQuota?: SchoolSportQuota;
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
}

export function QuotaDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  schools,
  selectedSchool,
  setSelectedSchool,
  existingQuota,
  title,
  description,
  submitLabel,
  isLoading,
}: QuotaDialogProps) {
  const SportquotaForm = useForm<SportQuotaFormValues>({
    resolver: zodResolver(sportQuotaFormSchema),
    defaultValues: {
      participant_quota: undefined,
      team_quota: undefined,
    },
  });

  useEffect(() => {
    if (existingQuota) {
      SportquotaForm.reset({
        participant_quota: existingQuota.participant_quota || undefined,
        team_quota: existingQuota.team_quota || undefined,
      });
    }
  }, [existingQuota, SportquotaForm]);

  const handleCancel = () => {
    onOpenChange(false);
    SportquotaForm.reset();
    setSelectedSchool(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un quota pour ce sport
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...SportquotaForm}>
          <form
            onSubmit={SportquotaForm.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormItem className="w-full">
              <FormLabel>École</FormLabel>
              <Select
                value={selectedSchool || ""}
                onValueChange={(value) => setSelectedSchool(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez une école" />
                </SelectTrigger>
                <SelectContent>
                  {schools?.map((school) => {
                    const hasQuota = !!existingQuota;
                    if (!hasQuota) {
                      return (
                        <SelectItem key={school.id} value={school.id}>
                          {formatSchoolName(school.name)}
                        </SelectItem>
                      );
                    }
                    return null;
                  })}
                </SelectContent>
              </Select>
            </FormItem>

            <StyledFormField
              form={SportquotaForm}
              label="Quota de participants pour ce sport"
              id="participant_quota"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <StyledFormField
              form={SportquotaForm}
              label="Quota d'équipes pour ce sport"
              id="team_quota"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={field.onChange}
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

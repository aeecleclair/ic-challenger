import z from "zod";
import { registeringFormSchema } from "../forms/registering";

// Define the form data type based on the schema
type RegisteringFormData = z.infer<typeof registeringFormSchema>;

// Create a type that represents all possible paths in the form, including nested paths
type FormFieldPath = 
  | keyof RegisteringFormData  // Direct top-level fields like 'phone', 'status', etc.
  | `sport.${keyof NonNullable<RegisteringFormData['sport']> & string}`; // Nested sport fields with dot notation

// Define the header subtitle options based on the actual values used
export type HeaderSubtitle =
  | "Informations"
  | "Participation"
  | "Sport"
  | "Package"
  | "Récapitulatif";

export interface RegisterState {
  currentStep: number;
  stepDone: number;
  headerTitle: string;
  headerSubtitle: HeaderSubtitle;
  allHeaderSubtitles: HeaderSubtitle[];
  pageFields: Record<HeaderSubtitle, FormFieldPath[]>;
  onValidateCardActions: Record<HeaderSubtitle, (data: RegisteringFormData, callback: () => void) => void>;
}
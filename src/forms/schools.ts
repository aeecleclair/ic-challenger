import { z } from "zod";

export const schoolFormSchema = z.object({
  schools: z
    .string({
      required_error: "Veuillez renseigner le nom de l'école",
    })
    .uuid("Le format de l'ID de l'école est invalide"),
  fromLyon: z.boolean(),
  active: z.boolean(),
  inscription_enabled: z.boolean(),
  // athleteQuota: z.number({
  //   required_error: "Veuillez renseigner le quota d'athlètes",
  // }).min(0, "Le quota d'athlètes doit être supérieur ou égal à 0"),
  // cameramanQuota: z.number({
  //   required_error: "Veuillez renseigner le quota de cameramen",
  // }).min(0, "Le quota de cameramen doit être supérieur ou égal à 0"),
  // cheerleaderQuota: z.number({
  //   required_error: "Veuillez renseigner le quota de pompom",
  // }).min(0, "Le quota de pompom doit être supérieur ou égal à 0"),
  // fanfareQuota: z.number({
  //   required_error: "Veuillez renseigner le quota de fanfare",
  // }).min(0, "Le quota de fanfare doit être supérieur ou égal à 0"),
  // nonAthleteQuota: z.number({
  //   required_error: "Veuillez renseigner le quota de non-athlètes",
  // }).min(0, "Le quota de non-athlètes doit être supérieur ou égal à 0"),
});

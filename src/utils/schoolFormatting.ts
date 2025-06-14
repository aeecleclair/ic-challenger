export function formatSchoolName(name?: string): string | undefined {
  return name?.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

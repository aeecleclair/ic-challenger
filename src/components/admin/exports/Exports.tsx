import { CaptainsExport } from "./CaptainsExport";
import { GlobalExport } from "./GlobalExport";
import { SchoolQuotasExport } from "./SchoolQuotasExport";
import { SchoolUsersExport } from "./SchoolUsersExport";
import { SportParticipantsExport } from "./SportParticipantsExport";
import { SportQuotasExport } from "./SportQuotasExport";

export const ExportsPage = () => {
  return (
    <div className="grid gap-6 grid-cols-3">
      <GlobalExport />
      <SchoolUsersExport />
      <SchoolQuotasExport />
      <SportQuotasExport />
      <SportParticipantsExport />
      <CaptainsExport />
    </div>
  );
};

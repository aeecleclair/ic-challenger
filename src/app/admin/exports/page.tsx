"use client";

import { EditionManagement } from "@/src/components/admin/editions/EditionManagement";
import { ExportsPage } from "@/src/components/admin/exports/Exports";

export default function EditionsPage() {
  return (
    <div className="space-y-6">
      {/* Header with title and action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sports</h1>
          <p className="text-muted-foreground">
            Exports des données de l&apos;édition
          </p>
        </div>
      </div>
      <ExportsPage />
    </div>
  );
}

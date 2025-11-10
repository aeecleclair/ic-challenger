"use client";

import { EditionManagement } from "@/src/components/admin/editions/EditionManagement";

export default function EditionsPage() {
  return (
    <div className="flex w-full flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-bold">Gestion des éditions</span>
      </div>

      <EditionManagement />
    </div>
  );
}
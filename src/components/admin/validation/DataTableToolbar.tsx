"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/src/components/ui/button";
import React, { useMemo } from "react";
import { Input } from "@/src/components/ui/input";
import { DataTableFacetedFilter } from "../registered-table/DataTableFacetedFilter";
import { DataTableFilterCheckBox } from "../registered-table/DataTableFilterCheckBox";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  sports: {
    label: string;
    value: string;
  }[];
  typeOptions: {
    label: string;
    value: string;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  typeOptions,
  sports,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={
            (table.getColumn("searchField")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("searchField")?.setFilterValue(event.target.value)
          }
          className="h-8 max-w-sm"
        />

        {/* Sport filter dropdown */}
        {table.getColumn("sportName") && (
          <select
            className="border rounded px-2 py-1 text-sm"
            onChange={(e) =>
              table
                .getColumn("sportName")
                ?.setFilterValue(
                  e.target.value === "" ? undefined : e.target.value,
                )
            }
            defaultValue=""
          >
            <option value="">Tous les sports</option>
            {sports.map((sport) => (
              <option key={sport.value} value={sport.value}>
                {sport.label}
              </option>
            ))}
          </select>
        )}

        {table.getColumn("participantType") && (
          <DataTableFacetedFilter
            column={table.getColumn("participantType")}
            title="Type"
            options={typeOptions}
          />
        )}

        {table.getColumn("license") && (
          <DataTableFilterCheckBox
            column={table.getColumn("license")}
            title="Licence"
          />
        )}

        {table.getColumn("isSubstitute") && (
          <DataTableFilterCheckBox
            column={table.getColumn("isSubstitute")}
            title="Remplaçant"
          />
        )}

        {table.getColumn("isValidated") && (
          <DataTableFilterCheckBox
            column={table.getColumn("isValidated")}
            title="Validé"
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Supprimer les filtres
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

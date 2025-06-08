"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "../../ui/checkbox";
import { Badge } from "../../ui/badge";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { ParticipantPreview, TeamPreview } from "@/src/api/hyperionSchemas";
import {
  difficulties,
  getLabelFromValue,
  meetingPlaces,
} from "@/src/infra/comboboxValues";
import { CircularProgressBar } from "../../custom/CircularProgressBar";
import { ProgressBadge } from "../../custom/ProgressBadge";

export const columns: ColumnDef<TeamPreview>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipe" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "captain",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Capitaine" />
    ),
    cell: ({ row }) => {
      const captain = row.getValue("captain") as ParticipantPreview;
      return (
        <div className="flex space-x-2">
          {captain.firstname} {captain.name}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "second",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Coéquiper" />
    ),
    cell: ({ row }) => {
      const second = row.getValue("second") as ParticipantPreview | undefined;
      return (
        <div className={`flex space-x-2 ${second ?? "text-muted-foreground"}`}>
          {second ? `${second.firstname} ${second.name}` : "Non renseigné"}
        </div>
      );
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Parcours"
        className="max-lg:hidden"
      />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2 max-lg:hidden">
        <Badge variant="outline">
          {getLabelFromValue(difficulties, row.getValue("difficulty"))}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "meeting_place",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Lieu de rendez-vous"
        className="max-lg:hidden"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-lg:hidden">
          <Badge variant="outline">
            {getLabelFromValue(meetingPlaces, row.getValue("meeting_place"))}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "validation_progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inscription" className="" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 items-center">
          <span>
            {(row.getValue("validation_progress") as number).toFixed(0)}%
          </span>
        </div>
      );
    },
    sortingFn: (rowA, rowB, id) => {
      return (rowA.getValue(id) as number) - (rowB.getValue(id) as number);
    },
  },
  {
    accessorKey: "document_progress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documents" />
    ),
    cell: ({ row }) => {
      const number_of_validated_document =
        (row.getValue("captain") as ParticipantPreview)
          .number_of_validated_document +
        ((row.getValue("second") as ParticipantPreview | null)
          ?.number_of_validated_document ?? 0);
      const number_of_document =
        (row.getValue("captain") as ParticipantPreview).number_of_document +
        ((row.getValue("second") as ParticipantPreview | null)
          ?.number_of_document ?? 0);
      return (
        <ProgressBadge
          progress={number_of_validated_document}
          total={number_of_document}
        />
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

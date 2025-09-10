"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ArrowUpDown, CheckCircle, MoreHorizontal, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { DataTablePagination } from "@/src/components/ui/data-table-pagination";
import { DataTableToolbar } from "./DataTableToolbar";

export interface ParticipantData {
  userId: string;
  sportId: string;
  sportName: string;
  fullName: string;
  email: string;
  license: string;
  teamId?: string | null;
  teamName?: string | null;
  isSubstitute: boolean;
  isValidated: boolean;
  isCaptain: boolean;
  participantType: string;
  hasPaid?: boolean;
}

interface ParticipantDataTableProps {
  data: ParticipantData[];
  schoolName: string;
  onValidateParticipant: (userId: string, sportId: string) => void;
  isLoading: boolean;
}

export function ParticipantDataTable({
  data,
  onValidateParticipant,
  isLoading,
}: ParticipantDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns: ColumnDef<ParticipantData>[] = [
    {
      id: "searchField",
      accessorFn: (row) => `${row.fullName} ${row.email}`.toLowerCase(),
      filterFn: (row, columnId, filterValue) => {
        const searchTerm = filterValue.toLowerCase();
        const fullName = row.getValue<string>("fullName").toLowerCase();
        const email = row.getValue<string>("email").toLowerCase();
        return fullName.includes(searchTerm) || email.includes(searchTerm);
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const fullName = row.getValue("fullName") as string;
        const isCaptain = row.original.isCaptain;

        return (
          <div className="font-medium text-center flex items-center justify-center gap-2">
            {isCaptain && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Users className="h-4 w-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Capitaine d&apos;équipe</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {fullName}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "license",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Licence
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("license") || "Non renseignée"}
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<string>(id);
        return filterValue === true ? Boolean(value) : true;
      },
    },
    {
      accessorKey: "teamName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Équipe
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const teamName = row.getValue("teamName") as string;

        if (!teamName || teamName === "-") {
          return <div className="text-center text-muted-foreground">-</div>;
        }

        return (
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
            >
              {teamName}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<string>(id);
        return filterValue === true ? Boolean(value) : true;
      },
    },
    {
      accessorKey: "participantType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const participantType = row.getValue("participantType") as string;
        const types = participantType.split(", ");

        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {types.map((type, index) => {
              let badgeClass = "";
              switch (type) {
                case "Athlète":
                  badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-200";
                  break;
                case "Pompom":
                  badgeClass = "bg-pink-100 text-pink-800 hover:bg-pink-200";
                  break;
                case "Fanfare":
                  badgeClass =
                    "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
                  break;
                case "Cameraman":
                  badgeClass =
                    "bg-purple-100 text-purple-800 hover:bg-purple-200";
                  break;
                case "Bénévole":
                  badgeClass = "bg-green-100 text-green-800 hover:bg-green-200";
                  break;
                default:
                  badgeClass = "";
              }

              return (
                <Badge key={index} variant="secondary" className={badgeClass}>
                  {type}
                </Badge>
              );
            })}
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue || (filterValue as string[]).length === 0) return true;
        const types = (row.getValue(id) as string).split(", ");
        return types.some((type) => (filterValue as string[]).includes(type));
      },
    },
    {
      accessorKey: "isSubstitute",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Remplaçant
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue("isSubstitute") ? (
            <Badge variant="outline">Oui</Badge>
          ) : (
            <Badge variant="secondary">Non</Badge>
          )}
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<boolean>(id);
        return filterValue === true ? value === true : true;
      },
    },
    {
      accessorKey: "isValidated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Validé
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue("isValidated") ? (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200"
            >
              Oui
            </Badge>
          ) : (
            <Badge variant="destructive">Non</Badge>
          )}
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<boolean>(id);
        return filterValue === true ? value === true : true;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const participant = row.original;

        if (participant.isValidated) {
          const hasPaid = participant.hasPaid;

          if (hasPaid === undefined) {
            return (
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-gray-100 text-gray-600">
                  Paiement: Inconnu
                </Badge>
              </div>
            );
          }

          return (
            <div className="flex justify-center">
              {hasPaid ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  Payé
                </Badge>
              ) : (
                <Badge variant="destructive">En attente de paiement</Badge>
              )}
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    onValidateParticipant(
                      participant.userId,
                      participant.sportId,
                    )
                  }
                  disabled={isLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Valider
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  React.useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      searchField: false,
    }));
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const participantTypes = React.useMemo(() => {
    const types = new Set<string>();
    data.forEach((item) => {
      const itemTypes = item.participantType.split(", ");
      itemTypes.forEach((type) => types.add(type));
    });

    return Array.from(types).map((type) => ({
      label: type,
      value: type,
    }));
  }, [data]);

  return (
    <div>
      <DataTableToolbar table={table} typeOptions={participantTypes} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id === "searchField") return null;

                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.id === "actions" ? "text-center" : "text-center"
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === "searchField") return null;

                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "actions"
                            ? "text-center"
                            : "text-center"
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length - 1}
                  className="text-center py-4 text-muted-foreground"
                >
                  Aucun participant trouvé pour cette école
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination
          table={table}
          selectedLabel="participant(s) sélectionné(s)"
          itemsPerPageLabel="Participants par page"
          showSelectedCount={false}
        />
      </div>
    </div>
  );
}

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
import { ArrowUpDown, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Badge } from "@/src/components/ui/badge";
import { DataTableToolbar } from "./DataTableToolbar";

// Extended participant info with formatted data
export interface ParticipantData {
  userId: string;
  sportId: string;
  sportName: string;
  fullName: string;
  email: string;
  license: string;
  teamId?: string | null;
  isSubstitute: boolean;
  isValidated: boolean;
  participantType: string;
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

  // Create a virtual column for search that's not actually rendered
  const columns: ColumnDef<ParticipantData>[] = [
    {
      id: "searchField",
      accessorFn: row => `${row.fullName} ${row.email}`.toLowerCase(),
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
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("fullName")}</div>
      ),
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
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "sportName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Sport
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("sportName")}</div>,
      filterFn: (row, id, filterValue) => {
        const sportName = row.getValue<string>(id);
        return (filterValue as string[])?.includes(sportName) ?? true;
      },
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
        <div>{row.getValue("license") || "Non renseignée"}</div>
      ),
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
          <div className="flex flex-wrap gap-1">
            {types.map((type, index) => {
              let badgeClass = "";
              switch(type) {
                case "Athlète":
                  badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-200";
                  break;
                case "Pompom":
                  badgeClass = "bg-pink-100 text-pink-800 hover:bg-pink-200";
                  break;
                case "Fanfare":
                  badgeClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
                  break;
                case "Cameraman":
                  badgeClass = "bg-purple-100 text-purple-800 hover:bg-purple-200";
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
        
        // Split the participant types into an array
        const types = (row.getValue(id) as string).split(", ");
        
        // Check if any of the types match the selected filter values
        return types.some(type => (filterValue as string[]).includes(type));
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
        <div>
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
        <div>
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
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const participant = row.original;

        // Don't show validate action if already validated
        if (participant.isValidated) {
          return <div className="text-right">Déjà validé</div>;
        }

        return (
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
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
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Valider ce participant</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  // Setup column visibility to hide the searchField column
  React.useEffect(() => {
    // Hide the virtual searchField column
    setColumnVisibility((prev) => ({
      ...prev,
      searchField: false
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
    getSortedRowModel: getSortedRowModel(),
  });

  // Extract unique sports for faceted filter
  const sports = React.useMemo(() => {
    const uniqueSports = new Set(data.map(item => item.sportName));
    return Array.from(uniqueSports).map(sport => ({
      label: sport,
      value: sport
    }));
  }, [data]);

  // Extract unique participant types for faceted filter
  const participantTypes = React.useMemo(() => {
    // First, collect all individual types from all participants
    const types = new Set<string>();
    data.forEach(item => {
      const itemTypes = item.participantType.split(", ");
      itemTypes.forEach(type => types.add(type));
    });
    
    return Array.from(types).map(type => ({
      label: type,
      value: type
    }));
  }, [data]);

  return (
    <div>
      <DataTableToolbar 
        table={table} 
        sportOptions={sports}
        typeOptions={participantTypes} 
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // Don't render the searchField column header
                  if (header.id === "searchField") return null;
                  
                  return (
                    <TableHead
                      key={header.id}
                      className={header.id === "actions" ? "text-right" : ""}
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
                    // Don't render the searchField column cell
                    if (cell.column.id === "searchField") return null;
                    
                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "actions" ? "text-right" : ""
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
                  colSpan={columns.length - 1} // Subtract 1 for the hidden searchField column
                  className="text-center py-4 text-muted-foreground"
                >
                  Aucun participant trouvé pour cette école
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

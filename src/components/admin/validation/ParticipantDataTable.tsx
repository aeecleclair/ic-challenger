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
import {
  ArrowUpDown,
  CheckCircle,
  MoreHorizontal,
  UserPlus,
  Users,
  XCircle,
  Trash2,
} from "lucide-react";
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
import { toast } from "../../ui/use-toast";
import { RequiredPurchase, UserProductsCell } from "./UserProductsCell";
import { useProducts } from "@/src/hooks/useProducts";
import {
  AppModulesSportCompetitionSchemasSportCompetitionPaymentBase,
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete,
} from "@/src/api/hyperionSchemas";
import { AddPaymentDialog } from "./AddPaymentDialog";
import { usePostCompetitionUsersUserIdPayments } from "@/src/api/hyperionComponents";
import { useAuth } from "@/src/hooks/useAuth";
import { CreditCard } from "lucide-react";
import { useUser } from "@/src/hooks/useUser";
import { useUserPayments } from "@/src/hooks/useUserPayments";
import Link from "next/link";

export interface ParticipantData {
  userId: string;
  sportId?: string;
  sportName?: string;
  fullName: string;
  email: string;
  isLicenseValid?: boolean;
  teamId?: string;
  teamName?: string;
  isSubstitute: boolean;
  isValidated: boolean;
  isCaptain: boolean;
  participantType: string;
  hasPaid?: boolean;
  partialPaid?: boolean;
  allowPictures: boolean;
  requiredProductNames?: string[]; // Array of required product names for filtering
  requiredPurchases?: RequiredPurchase;
}

interface ParticipantDataTableProps {
  data: ParticipantData[];
  schoolName: string;
  onValidateParticipant: (userId: string) => void;
  onInvalidateParticipant: (userId: string) => void;
  onDeleteParticipant: (
    userId: string,
    sportId: string,
    isAthlete: boolean,
  ) => void;
  isLoading: boolean;
}

export function ParticipantDataTable({
  data,
  onValidateParticipant,
  onInvalidateParticipant,
  onDeleteParticipant,
  isLoading,
}: ParticipantDataTableProps) {
  const { isAdmin } = useUser();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      isCaptain: false,
      isSubstitute: false,
      searchField: false,
      productNames: false,
    });
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    React.useState<ParticipantData | null>(null);

  const { products } = useProducts();
  const { makePayment, isPostingPayment } = useUserPayments();

  const handleAddPayment = async (amount: number) => {
    if (!selectedParticipant) return;
    const body: AppModulesSportCompetitionSchemasSportCompetitionPaymentBase = {
      total: amount * 100, // Convert to cents
    };
    await makePayment(selectedParticipant.userId, body);
  };

  const sports = React.useMemo(() => {
    const sportSet = new Set<string>();
    data.forEach((participant) => {
      if (participant.sportName) {
        sportSet.add(participant.sportName);
      }
    });
    return Array.from(sportSet).map((sport) => ({
      label: sport,
      value: sport,
    }));
  }, [data]);

  const columns: ColumnDef<ParticipantData>[] = [
    {
      accessorKey: "isCaptain",
      header: "Capitaine",
      enableHiding: true,
      cell: () => null,
      filterFn: (row, id, value) => {
        if (value === undefined) return true;
        return row.getValue<boolean>(id) === value;
      },
    },
    {
      accessorKey: "isSubstitute",
      header: "Remplaçant",
      enableHiding: true,
      cell: () => null,
      filterFn: (row, id, value) => {
        if (value === undefined) return true;
        return row.getValue<boolean>(id) === value;
      },
    },
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
      id: "productNames",
      header: "Produits",
      enableHiding: true,
      cell: () => null,
      accessorFn: (row) => {
        // Return the product names array as a joined string for filtering
        return row.requiredProductNames?.join(", ") || "";
      },
      filterFn: (row, id, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        const productNames = row.original.requiredProductNames || [];
        return filterValue.some((product: string) =>
          productNames.includes(product),
        );
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
        const isSubstitute = row.original.isSubstitute;

        return (
          <Link
            href={`/admin/validation/detail?user_id=${row.original.userId}`}
            className="font-medium text-center flex items-center justify-center gap-2 underline hover:no-underline"
          >
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
              {isSubstitute && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <UserPlus className="h-4 w-4" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remplaçant</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {fullName}
            </div>
          </Link>
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
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="secondary">{row.getValue("sportName") || "-"}</Badge>
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
      accessorKey: "isLicenseValid",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          License
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const participantType = row.getValue("participantType") as string;
        const types = participantType.split(", ");
        if (!types.includes("Athlète")) {
          return <div className="text-center text-muted-foreground">-</div>;
        }
        return (
          <div className="flex justify-center">
            {row.getValue("isLicenseValid") ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200"
              >
                Validée
              </Badge>
            ) : (
              <Badge variant="destructive">En attente</Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<boolean>(id);
        return filterValue === true ? value === true : true;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;
        if (a.isLicenseValid === b.isLicenseValid) return 0;
        if (a.isLicenseValid) return -1;
        return 1;
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
          Inscription
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const participant = row.original;
        return !participant.isValidated ? (
          <Badge variant="destructive">Non validée</Badge>
        ) : participant.hasPaid === undefined ? (
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            Validé : Paiement inconnu
          </Badge>
        ) : !participant.hasPaid ? (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            En attente de paiement
          </Badge>
        ) : participant.partialPaid ? (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          >
            Validé et Paiement partiel
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-200"
          >
            Validé et Payé
          </Badge>
        );
      },
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<boolean>(id);
        return filterValue === true ? value === true : true;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;
        if (a.isValidated === b.isValidated) {
          if (a.hasPaid === b.hasPaid) return 0;
          if (a.hasPaid) return -1;
          return 1;
        }
        if (a.isValidated) return -1;
        return 1;
      },
    },
    {
      accessorKey: "allowPictures",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Autorisation photos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            {row.getValue("allowPictures") ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 hover:bg-green-200"
              >
                ✓ Autorisée
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-red-100 text-red-800 hover:bg-red-200"
              >
                ✗ Refusée
              </Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<boolean>(id);
        return filterValue === true ? value === true : true;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;
        if (a.allowPictures === b.allowPictures) return 0;
        if (a.allowPictures) return -1;
        return 1;
      },
    },
    {
      id: "requiredProducts",
      header: () => <div className="text-center">Produits obligatoires</div>,
      cell: ({ row }) => {
        const participant = row.original;
        return (
          <div className="flex justify-center">
            <UserProductsCell
              requiredPurchases={participant.requiredPurchases}
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const participant = row.original;

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
                  onClick={() => {
                    if (participant?.isValidated) {
                      if (participant?.hasPaid) {
                        toast({
                          title: "Erreur",
                          description:
                            "Vous ne pouvez pas dévalider un utilisateur ayant payé",
                          variant: "destructive",
                        });
                      } else {
                        onInvalidateParticipant(participant.userId);
                      }
                    } else {
                      onValidateParticipant(participant.userId);
                    }
                  }}
                  disabled={isLoading}
                >
                  {participant?.isValidated ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Invalider
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Valider
                    </>
                  )}
                </DropdownMenuItem>
                {isAdmin() && (
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedParticipant(participant);
                      setPaymentDialogOpen(true);
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Enregistrer un paiement
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    if (participant?.hasPaid) {
                      toast({
                        title: "Erreur",
                        description:
                          "Vous ne pouvez pas supprimer un utilisateur ayant payé",
                        variant: "destructive",
                      });
                    } else {
                      onDeleteParticipant(
                        participant.userId,
                        participant.sportId || "",
                        !!participant.sportId,
                      );
                    }
                  }}
                  disabled={isLoading}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
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

  const requiredProductOptions = React.useMemo(() => {
    if (!products) return [];
    return products
      .filter((product) => product.required)
      .map((product) => ({
        label: product.name,
        value: product.name,
      }));
  }, [products]);

  return (
    <div>
      <DataTableToolbar
        table={table}
        typeOptions={participantTypes}
        sports={sports}
        products={requiredProductOptions}
      />
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
      <AddPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onConfirm={handleAddPayment}
        participantName={selectedParticipant?.fullName || ""}
        isLoading={isPostingPayment}
      />
    </div>
  );
}

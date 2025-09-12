"use client";

import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Eye,
  Package,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Euro,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductCard = ({
  product,
  onClick,
  onEdit,
  onDelete,
}: ProductCardProps) => {
  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariants =
    product.variants?.filter((variant) => variant.enabled !== false).length ||
    0;
  const totalVariants = product.variants?.length || 0;

  // Since there's no is_active on product, we'll consider it active if it has active variants or is required
  const isProductActive =
    product.required || (hasVariants && activeVariants > 0);

  const getProductStatusColor = () => {
    if (isProductActive) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-red-100 text-red-800 border-red-200";
  };

  // Get price from the first variant if available
  const basePrice = product.variants?.[0]?.price;

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          {product.name}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {product.required && (
            <Badge
              variant="outline"
              className="gap-1 bg-orange-100 text-orange-800 border-orange-200"
            >
              <ShoppingCart className="h-3 w-3" />
              Obligatoire
            </Badge>
          )}
          <Badge
            variant={isProductActive ? "default" : "destructive"}
            className="gap-1"
          >
            {isProductActive ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {isProductActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          {hasVariants && (
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>
                {activeVariants}/{totalVariants} variant
                {totalVariants !== 1 ? "s" : ""} active
                {totalVariants !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {basePrice !== undefined && (
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4" />
              <span>À partir de {basePrice}€</span>
            </div>
          )}
          {product.description && (
            <div className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </div>
          )}
        </div>
        <div className="mt-3">
          <Link
            href={`/admin/products?product_id=${product.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Eye className="h-4 w-4" />
            Voir les détails
          </Link>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) {
                onEdit();
              }
            }}
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

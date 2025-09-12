"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Euro,
  CheckCircle,
  XCircle,
  Plus,
  ShoppingCart,
  Info,
} from "lucide-react";
import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";

interface ProductDetailProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddVariant?: () => void;
  onEditVariant?: (variantId: string) => void;
  onDeleteVariant?: (variantId: string) => void;
}

const ProductDetail = ({
  product,
  onEdit,
  onDelete,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
}: ProductDetailProps) => {
  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariants =
    product.variants?.filter((variant) => variant.enabled !== false).length ||
    0;
  const totalVariants = product.variants?.length || 0;
  const isProductActive =
    product.required || (hasVariants && activeVariants > 0);

  const getSchoolTypeLabel = (schoolType: string) => {
    switch (schoolType) {
      case "lyon":
        return "École Lyonnaise";
      case "external":
        return "École Externe";
      case "all":
        return "Toutes les écoles";
      default:
        return schoolType;
    }
  };

  const getPublicTypeLabel = (publicType?: string) => {
    switch (publicType) {
      case "student":
        return "Étudiants";
      case "staff":
        return "Personnel";
      case "all":
        return "Tous";
      default:
        return publicType || "Non défini";
    }
  };

  const getSchoolTypeColor = (schoolType: string) => {
    switch (schoolType) {
      case "lyon":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "external":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "all":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            {product.name}
          </h1>
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
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          <Button variant="destructive" onClick={onDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Product Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nom du produit
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {product.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Variants
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {activeVariants}/{totalVariants}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Euro className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Prix minimum
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {product.variants && product.variants.length > 0
                    ? `${Math.min(...product.variants.map((v) => v.price))}€`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informations du produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Détails généraux</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nom
                  </p>
                  <p className="text-sm">{product.name}</p>
                </div>
                {product.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Obligatoire
                  </p>
                  <p className="text-sm">{product.required ? "Oui" : "Non"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Identifiants</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ID Produit
                  </p>
                  <p className="text-sm font-mono">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ID Édition
                  </p>
                  <p className="text-sm font-mono">{product.edition_id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Variants ({totalVariants})
            </CardTitle>
            {onAddVariant && (
              <Button onClick={onAddVariant} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un variant
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasVariants ? (
            <div className="space-y-4">
              {product.variants?.map((variant) => (
                <Card key={variant.id} className="border border-border">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{variant.name}</h4>
                          <Badge
                            variant={
                              variant.enabled !== false
                                ? "default"
                                : "destructive"
                            }
                            className="gap-1"
                          >
                            {variant.enabled !== false ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {variant.enabled !== false ? "Actif" : "Inactif"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`gap-1 ${getSchoolTypeColor(variant.school_type)}`}
                          >
                            {getSchoolTypeLabel(variant.school_type)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Prix</p>
                            <p className="font-medium">{variant.price}€</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Public cible
                            </p>
                            <p className="font-medium">
                              {getPublicTypeLabel(
                                variant.public_type || undefined,
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Unique</p>
                            <p className="font-medium">
                              {variant.unique ? "Oui" : "Non"}
                            </p>
                          </div>
                        </div>
                        {variant.description && (
                          <div className="mt-2">
                            <p className="text-muted-foreground text-sm">
                              Description
                            </p>
                            <p className="text-sm">{variant.description}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {onEditVariant && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditVariant(variant.id)}
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Modifier
                          </Button>
                        )}
                        {onDeleteVariant && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeleteVariant(variant.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Aucun variant</p>
              <p className="mb-4">
                Ce produit n&apos;a pas encore de variants configurés.
              </p>
              {onAddVariant && (
                <Button onClick={onAddVariant} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter le premier variant
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetail;

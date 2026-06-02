import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertTriangle, Package } from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const coverImage =
    product?.images?.[0] || product?.image || "/placeholder.png";

  const totalStock = product?.totalStock ?? 0;
  const hasLowStock = product?.hasLowStock || false;
  const isOutOfStock = totalStock === 0;

  const lowStockVariants = (product?.sizeVariants || []).filter(
    (v) => v.stock <= 5 && v.stock > 0
  );

  return (
    <Card className="w-full max-w-sm mx-auto bg-card border-border shadow-sm overflow-hidden">
      <div>
        <div className="relative">
          <img
            src={coverImage}
            alt={product?.title}
            className="w-full h-[260px] object-contain p-4 bg-muted/10 rounded-t-lg"
          />
          {/* Stock status badges */}
          {isOutOfStock ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
              Out Of Stock
            </Badge>
          ) : hasLowStock ? (
            <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Low Stock
            </Badge>
          ) : null}

          {/* Image count indicator */}
          {product?.images?.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              +{product.images.length - 1} more
            </div>
          )}
        </div>

        <CardContent className="pt-3 pb-1">
          <h2 className="text-base font-bold mb-1 truncate" title={product?.title}>
            {product?.title}
          </h2>

          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
              } text-sm font-semibold`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-sm font-bold text-primary">
                ₹{product?.salePrice}
              </span>
            )}
          </div>

          {/* Stock overview */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Package className="w-3.5 h-3.5" />
            <span>Total Stock: <strong className={isOutOfStock ? "text-red-500" : "text-foreground"}>{totalStock}</strong></span>
          </div>

          {/* Low-stock sizes breakdown */}
          {lowStockVariants.length > 0 && (
            <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3 h-3" /> Low stock sizes:
              </p>
              <div className="flex flex-wrap gap-1">
                {lowStockVariants.map((v) => (
                  <span
                    key={v.id || v.size}
                    className="text-[11px] bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium"
                  >
                    {v.size}: {v.stock} left
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?.id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="flex-1"
            onClick={() => handleDelete(product?.id)}
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;

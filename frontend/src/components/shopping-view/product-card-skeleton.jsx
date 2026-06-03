import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Skeleton loader for ShoppingProductTile — exact dimensions to prevent layout shift.
 */
function ProductCardSkeleton() {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <SkeletonTheme
      baseColor={isDark ? "#1f2937" : "#f3f4f6"}
      highlightColor={isDark ? "#374151" : "#e5e7eb"}
    >
      <div className="rounded-xl overflow-hidden border border-border bg-card">
        {/* Image placeholder */}
        <Skeleton height={260} className="block" />
        <div className="p-4 space-y-2">
          {/* Tags */}
          <div className="flex gap-1">
            <Skeleton width={56} height={18} borderRadius={99} />
            <Skeleton width={72} height={18} borderRadius={99} />
          </div>
          {/* Title */}
          <Skeleton height={16} width="80%" />
          <Skeleton height={16} width="60%" />
          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <Skeleton height={20} width={64} />
            <Skeleton height={16} width={48} />
          </div>
          {/* Button */}
          <Skeleton height={36} borderRadius={8} className="mt-2" />
        </div>
      </div>
    </SkeletonTheme>
  );
}

/**
 * Skeleton loader grid for admin KPI cards.
 */
export function StatCardSkeleton() {
  return (
    <SkeletonTheme baseColor="#1f2937" highlightColor="#374151">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton height={14} width={100} />
          <Skeleton height={32} width={32} borderRadius={8} />
        </div>
        <Skeleton height={28} width={80} />
        <Skeleton height={12} width={120} />
      </div>
    </SkeletonTheme>
  );
}

export default ProductCardSkeleton;

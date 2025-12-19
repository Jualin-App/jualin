import Skeleton from './Skeleton';

/**
 * Product Detail Skeleton
 * Loading placeholder untuk product detail page
 */
export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square" variant="rectangular" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, idx) => (
              <Skeleton key={idx} className="aspect-square" variant="rectangular" />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          {/* Category */}
          <Skeleton className="h-6 w-32" variant="text" />

          {/* Title */}
          <Skeleton className="h-8 w-full" variant="text" />
          <Skeleton className="h-8 w-3/4" variant="text" />

          {/* Price */}
          <Skeleton className="h-10 w-48" variant="text" />

          {/* Description */}
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-full" variant="text" />
            <Skeleton className="h-4 w-2/3" variant="text" />
          </div>

          {/* Seller info */}
          <div className="flex items-center gap-3 pt-4">
            <Skeleton className="w-12 h-12" variant="circular" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" variant="text" />
              <Skeleton className="h-3 w-24" variant="text" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Skeleton className="h-12 flex-1" variant="rectangular" />
            <Skeleton className="h-12 flex-1" variant="rectangular" />
          </div>
        </div>
      </div>
    </div>
  );
}

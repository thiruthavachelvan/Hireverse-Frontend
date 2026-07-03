// ─── Skeleton primitives ─────────────────────────────────────────
const Sk = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

// ─── Job card skeleton ───────────────────────────────────────────
export const SkeletonJobCard = () => (
  <div className="card-static p-5 space-y-4">
    <div className="flex items-start gap-3">
      <Sk className="w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Sk className="h-4 w-2/3" />
        <Sk className="h-3 w-1/3" />
      </div>
    </div>
    <Sk className="h-3 w-full" />
    <Sk className="h-3 w-4/5" />
    <div className="flex gap-2">
      <Sk className="h-6 w-16 rounded-full" />
      <Sk className="h-6 w-20 rounded-full" />
      <Sk className="h-6 w-14 rounded-full" />
    </div>
    <Sk className="h-9 w-full rounded-xl" />
  </div>
);

// ─── Feed post skeleton ───────────────────────────────────────────
export const SkeletonPostCard = () => (
  <div className="card-static p-5 space-y-4">
    <div className="flex items-center gap-3">
      <Sk className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Sk className="h-4 w-1/3" />
        <Sk className="h-3 w-1/4" />
      </div>
    </div>
    <Sk className="h-3 w-full" />
    <Sk className="h-3 w-5/6" />
    <Sk className="h-3 w-3/4" />
    <div className="flex gap-4 pt-2">
      <Sk className="h-6 w-16 rounded-full" />
      <Sk className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

// ─── Profile skeleton ─────────────────────────────────────────────
export const SkeletonProfile = () => (
  <div>
    <Sk className="h-40 w-full rounded-b-none rounded-t-2xl" />
    <div className="px-6 pb-6 -mt-8 space-y-4">
      <Sk className="w-20 h-20 rounded-full border-4 border-white" />
      <Sk className="h-5 w-1/3" />
      <Sk className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Sk className="h-7 w-16 rounded-full" />
        <Sk className="h-7 w-20 rounded-full" />
        <Sk className="h-7 w-14 rounded-full" />
      </div>
    </div>
  </div>
);

// ─── Table row skeleton ───────────────────────────────────────────
export const SkeletonTableRow = () => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-50">
    <Sk className="w-9 h-9 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Sk className="h-3.5 w-1/4" />
      <Sk className="h-3 w-1/3" />
    </div>
    <Sk className="h-6 w-20 rounded-full" />
    <Sk className="h-8 w-24 rounded-lg" />
  </div>
);

// ─── Analytics card skeleton ──────────────────────────────────────
export const SkeletonAnalyticsCard = () => (
  <div className="card-static p-5 space-y-3">
    <div className="flex justify-between items-start">
      <Sk className="h-4 w-24" />
      <Sk className="w-9 h-9 rounded-xl" />
    </div>
    <Sk className="h-8 w-16" />
    <Sk className="h-3 w-20 rounded-full" />
  </div>
);

// ─── Application card skeleton ────────────────────────────────────
export const SkeletonAppCard = () => (
  <div className="card-static p-5 space-y-4">
    <div className="flex gap-4">
      <Sk className="w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Sk className="h-4 w-2/3" />
        <Sk className="h-3 w-1/2" />
      </div>
      <Sk className="h-6 w-20 rounded-full" />
    </div>
    <div className="flex gap-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <Sk className="w-8 h-8 rounded-full" />
          <Sk className="h-3 w-12" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Generic page loader ──────────────────────────────────────────
export const SkeletonPage = ({ rows = 4 }) => (
  <div className="space-y-4 p-6 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonJobCard key={i} />
    ))}
  </div>
);

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-1 h-4 w-64" />
          </div>
          <div className="ml-auto">
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full max-w-md mb-4" />
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    </div>
  )
}


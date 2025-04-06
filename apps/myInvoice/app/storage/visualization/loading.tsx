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
        </div>
      </div>
      <div className="p-4">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    </div>
  )
}


import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { PageContainer } from "@/components/page-container"

export default function DashboardLoading() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title={<Skeleton className="h-8 w-48" />}
        description={<Skeleton className="h-5 w-64" />}
        actions={<Skeleton className="h-10 w-56" />}
      />
      <PageContainer>
        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-8 w-24" />
                  <Skeleton className="h-4 w-36" />
                </CardContent>
              </Card>
            ))}
        </div>
        <div className="p-4">
          <Skeleton className="mb-4 h-10 w-96" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <Skeleton className="mb-2 h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}


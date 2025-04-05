import { ErrorBoundary } from "@/utils/dynamicImport"
import { ChunkErrorFallback } from "@/components/chunk-error-fallback"
import { Button } from "@/components/shared/ui/button"

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {/* Example of using the shared Button component */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Welcome to 3D Box Viewer</h1>
          <p className="text-xl text-muted-foreground">Manage your storage boxes in 3D</p>
          <div className="flex gap-4 mt-4">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>

        {/* Existing content */}
        <div className="hidden">
          <ChunkErrorFallback />
        </div>
      </main>
    </ErrorBoundary>
  )
}


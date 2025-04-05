"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export function AwsIntegrationTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    environment?: string
    bucket?: string
    error?: string
  } | null>(null)

  const testStorageConfig = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/storage-test")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Test failed",
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AWS Integration Test</CardTitle>
        <CardDescription>Test your AWS configuration for local and cloud environments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm font-medium">Environment</div>
            <div className="text-sm">{process.env.NEXT_PUBLIC_SST_STAGE || "local"}</div>

            <div className="text-sm font-medium">API URL</div>
            <div className="text-sm">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}</div>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className="mt-4">
              {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                <p>{result.message}</p>
                {result.environment && <p>Environment: {result.environment}</p>}
                {result.bucket && <p>Bucket: {result.bucket}</p>}
                {result.error && <p className="text-red-500">Error: {result.error}</p>}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={testStorageConfig} disabled={isLoading} className="w-full">
          {isLoading ? "Testing..." : "Test Storage Configuration"}
        </Button>
      </CardFooter>
    </Card>
  )
}


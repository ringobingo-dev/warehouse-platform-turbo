import { AwsIntegrationTest } from "@/components/aws-integration-test"

export default function AwsTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">AWS Integration Test</h1>
      <p className="mb-8 text-muted-foreground">
        This page helps you verify that your AWS configuration is working correctly in both local and cloud
        environments.
      </p>

      <AwsIntegrationTest />
    </div>
  )
}


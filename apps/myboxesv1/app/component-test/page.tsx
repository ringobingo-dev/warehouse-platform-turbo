"use client"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
// We'll use the original card component first to verify the button works

export default function ComponentTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Component Test Page</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Button Component (Shared)</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg">Large</Button>
            <Button>Default</Button>
            <Button size="sm">Small</Button>
            <Button size="icon">
              <span>Icon</span>
            </Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Button States</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Card Component (Original)</h2>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  )
}


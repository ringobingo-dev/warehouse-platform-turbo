"use client"

import { Button } from "@/components/shared/ui/button"

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-foreground mb-6">
        Styling Test Page
      </h1>
      
      {/* Testing text styles */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-4">Text Styles</h2>
        <p className="text-foreground mb-2">Regular text in foreground color</p>
        <p className="text-muted-foreground mb-2">Muted text using theme colors</p>
        <p className="text-destructive mb-2">Destructive text color</p>
      </section>

      {/* Testing background colors */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-4">Background Colors</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-background border rounded">Background</div>
          <div className="p-4 bg-muted rounded">Muted</div>
          <div className="p-4 bg-primary text-primary-foreground rounded">Primary</div>
        </div>
      </section>

      {/* Testing components */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-4">Components</h2>
        <div className="space-y-4">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
        </div>
      </section>

      {/* Testing layout utilities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-4">Layout</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-card text-card-foreground rounded-lg shadow">
            Card with shadow
          </div>
          <div className="p-4 bg-popover text-popover-foreground rounded-lg border">
            Popover style
          </div>
        </div>
      </section>
    </div>
  )
}


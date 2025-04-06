"use client"

import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SidebarDemoPage() {
  return (
    <EnhancedSidebar>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Enhanced Sidebar Demo</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hover Techniques</CardTitle>
              <CardDescription>This sidebar demonstrates various hover techniques</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>CSS-based hover with Tailwind</li>
                <li>Group hover for parent-child relationships</li>
                <li>Peer hover for sibling relationships</li>
                <li>Conditional showing of elements on hover</li>
                <li>React state for complex hover logic</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Features</CardTitle>
              <CardDescription>Try these interactive features in the sidebar</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hover over menu items to reveal action buttons</li>
                <li>Expand/collapse workspace sections</li>
                <li>Click on the user profile to open the dropdown</li>
                <li>Toggle the sidebar using the trigger button</li>
                <li>Observe the different hover states and transitions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Hover Techniques Explained</CardTitle>
            <CardDescription>Detailed explanation of the hover techniques used in this sidebar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">CSS-Based Hover with Tailwind</h3>
              <p className="text-muted-foreground">
                Simple hover effects using Tailwind's hover: prefix, like hover:bg-accent
              </p>
              <pre className="bg-muted p-2 rounded-md mt-2 text-sm overflow-x-auto">
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium">Group Hover for Parent-Child</h3>
              <p className="text-muted-foreground">
                Show/hide elements when hovering over a parent using Tailwind's group hover pattern
              </p>
              <pre className="bg-muted p-2 rounded-md mt-2 text-sm overflow-x-auto">
                {`<div className="group/menu-item">
  <button>Menu Item</button>
  <div className="opacity-0 group-hover/menu-item:opacity-100">
    Action
  </div>
</div>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium">Peer Hover for Siblings</h3>
              <p className="text-muted-foreground">
                Style elements based on hover state of siblings using Tailwind's peer hover
              </p>
              <pre className="bg-muted p-2 rounded-md mt-2 text-sm overflow-x-auto">
                {`<button className="peer/button">Button</button>
<div className="peer-hover/button:text-primary">
  Changes when button is hovered
</div>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium">Conditional Element Display</h3>
              <p className="text-muted-foreground">Elements that only appear on hover using opacity transitions</p>
              <pre className="bg-muted p-2 rounded-md mt-2 text-sm overflow-x-auto">
                {`<SidebarMenuAction 
  showOnHover={true}
  className="group-hover/menu-item:opacity-100 md:opacity-0"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium">React State for Complex Logic</h3>
              <p className="text-muted-foreground">Using React state for more complex hover interactions</p>
              <pre className="bg-muted p-2 rounded-md mt-2 text-sm overflow-x-auto">
                {`const [isHovered, setIsHovered] = useState(false)

return (
  <div
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {isHovered && <AdditionalContent />}
  </div>
)`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnhancedSidebar>
  )
}


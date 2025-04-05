import { SidebarHoverExample } from "@/components/sidebar-hover-example"
import { SidebarHoverTechniques } from "@/components/sidebar-hover-techniques"

export default function SidebarHoverDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Sidebar Hover Techniques</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <h2 className="p-4 font-semibold border-b">Basic Examples</h2>
          <SidebarHoverExample />
        </div>

        <div className="border rounded-lg overflow-hidden shadow-sm">
          <h2 className="p-4 font-semibold border-b">Advanced Techniques</h2>
          <SidebarHoverTechniques />
        </div>
      </div>

      <div className="mt-12 prose max-w-none">
        <h2>Implementation Guide</h2>
        <p>
          The examples above demonstrate different techniques for implementing hover effects in a sidebar navigation.
          Each approach has its own advantages:
        </p>

        <ul>
          <li>
            <strong>Basic Hover</strong>: Simple Tailwind hover classes for straightforward effects
          </li>
          <li>
            <strong>Group Hover</strong>: Shows/hides elements when hovering over a parent container
          </li>
          <li>
            <strong>Peer Hover</strong>: Changes styles of elements based on hovering over a sibling element
          </li>
          <li>
            <strong>React State</strong>: Uses React state for more complex hover interactions and animations
          </li>
        </ul>

        <p>
          For standardization across applications, choose the approach that best fits your needs and implement it
          consistently.
        </p>
      </div>
    </div>
  )
}


import React from "react"
import { render, screen } from "@testing-library/react"
import { Badge } from "../badge"

describe("Badge", () => {
  test("renders correctly", () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText("New")
    expect(badge).toBeInTheDocument()
  })

  test("applies custom className", () => {
    render(<Badge className="custom-badge">New</Badge>)
    const badge = screen.getByText("New")
    expect(badge).toHaveClass("custom-badge")
  })

  test("renders with default variant", () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText("Default")
    expect(badge).toHaveClass("bg-primary")
  })

  test("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary</Badge>)
    const badge = screen.getByText("Secondary")
    expect(badge).toHaveClass("bg-secondary")
  })

  test("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive</Badge>)
    const badge = screen.getByText("Destructive")
    expect(badge).toHaveClass("bg-destructive")
  })

  test("renders with outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>)
    const badge = screen.getByText("Outline")
    expect(badge).toHaveClass("border")
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Badge ref={ref}>New</Badge>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.textContent).toBe("New")
  })

  test("renders as different element when using asChild", () => {
    render(
      <Badge asChild>
        <a href="#">Link Badge</a>
      </Badge>,
    )

    const badge = screen.getByText("Link Badge")
    expect(badge.tagName).toBe("A")
    expect(badge).toHaveAttribute("href", "#")
  })

  test("passes additional props to the element", () => {
    render(<Badge data-testid="test-badge">New</Badge>)
    const badge = screen.getByTestId("test-badge")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("New")
  })
})


import React from "react"
import { render, screen } from "@testing-library/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../card"

describe("Card component", () => {
  test("renders basic Card correctly", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeInTheDocument()
    expect(screen.getByText("Card content").closest("div")).toHaveClass("rounded-lg border bg-card")
  })

  test("applies custom className to Card", () => {
    render(<Card className="custom-class">Card content</Card>)
    expect(screen.getByText("Card content").closest("div")).toHaveClass("custom-class")
  })

  test("renders CardHeader correctly", () => {
    render(
      <Card>
        <CardHeader>Header content</CardHeader>
      </Card>,
    )
    expect(screen.getByText("Header content")).toBeInTheDocument()
    expect(screen.getByText("Header content").closest("div")).toHaveClass("flex flex-col space-y-1.5 p-6")
  })

  test("renders CardTitle correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
      </Card>,
    )
    expect(screen.getByText("Card Title")).toBeInTheDocument()
    expect(screen.getByText("Card Title").tagName).toBe("H3")
    expect(screen.getByText("Card Title")).toHaveClass("text-2xl font-semibold leading-none tracking-tight")
  })

  test("renders CardDescription correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
      </Card>,
    )
    expect(screen.getByText("Card Description")).toBeInTheDocument()
    expect(screen.getByText("Card Description")).toHaveClass("text-sm text-muted-foreground")
  })

  test("renders CardContent correctly", () => {
    render(
      <Card>
        <CardContent>Content area</CardContent>
      </Card>,
    )
    expect(screen.getByText("Content area")).toBeInTheDocument()
    expect(screen.getByText("Content area").closest("div")).toHaveClass("p-6 pt-0")
  })

  test("renders CardFooter correctly", () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>,
    )
    expect(screen.getByText("Footer content")).toBeInTheDocument()
    expect(screen.getByText("Footer content").closest("div")).toHaveClass("flex items-center p-6 pt-0")
  })

  test("renders a complete card with all sections", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>,
    )

    expect(screen.getByText("Complete Card")).toBeInTheDocument()
    expect(screen.getByText("This is a complete card example")).toBeInTheDocument()
    expect(screen.getByText("Main content goes here")).toBeInTheDocument()
    expect(screen.getByText("Action Button")).toBeInTheDocument()
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref}>Card with ref</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})


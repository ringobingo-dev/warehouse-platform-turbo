import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Label } from "../label"

describe("Label", () => {
  test("renders correctly", () => {
    render(<Label>Email</Label>)
    const label = screen.getByText("Email")
    expect(label).toBeInTheDocument()
  })

  test("applies custom className", () => {
    render(<Label className="custom-label">Email</Label>)
    const label = screen.getByText("Email")
    expect(label).toHaveClass("custom-label")
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Email</Label>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe("LABEL")
  })

  test("associates with form element using htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </>,
    )

    const label = screen.getByText("Email")
    expect(label).toHaveAttribute("for", "email")
  })

  test("clicking label focuses associated input", async () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" data-testid="email-input" />
      </>,
    )

    const label = screen.getByText("Email")
    const input = screen.getByTestId("email-input")

    await userEvent.click(label)
    expect(input).toHaveFocus()
  })

  test("renders with disabled state", () => {
    render(<Label disabled>Email</Label>)
    const label = screen.getByText("Email")
    expect(label).toHaveClass("opacity-50", "cursor-not-allowed")
  })

  test("renders with required indicator", () => {
    render(<Label required>Email</Label>)
    const label = screen.getByText("Email")
    expect(label.textContent).toContain("*")
  })

  test("passes additional props to the element", () => {
    render(<Label data-testid="test-label">Email</Label>)
    const label = screen.getByTestId("test-label")
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("Email")
  })
})


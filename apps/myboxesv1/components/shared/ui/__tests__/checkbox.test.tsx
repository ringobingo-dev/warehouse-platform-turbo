import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Checkbox } from "../checkbox"

describe("Checkbox component", () => {
  test("renders unchecked by default", () => {
    render(<Checkbox aria-label="Test checkbox" />)
    const checkbox = screen.getByRole("checkbox", { name: "Test checkbox" })
    expect(checkbox).not.toBeChecked()
  })

  test("renders checked when defaultChecked is true", () => {
    render(<Checkbox defaultChecked aria-label="Test checkbox" />)
    const checkbox = screen.getByRole("checkbox", { name: "Test checkbox" })
    expect(checkbox).toBeChecked()
  })

  test("can be controlled with checked prop", () => {
    const { rerender } = render(<Checkbox checked={false} aria-label="Test checkbox" />)
    const checkbox = screen.getByRole("checkbox", { name: "Test checkbox" })
    expect(checkbox).not.toBeChecked()

    rerender(<Checkbox checked={true} aria-label="Test checkbox" />)
    expect(checkbox).toBeChecked()
  })

  test("calls onCheckedChange when clicked", async () => {
    const handleChange = jest.fn()
    render(<Checkbox onCheckedChange={handleChange} aria-label="Test checkbox" />)

    const checkbox = screen.getByRole("checkbox", { name: "Test checkbox" })
    await userEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  test("can be disabled", async () => {
    const handleChange = jest.fn()
    render(<Checkbox disabled onCheckedChange={handleChange} aria-label="Test checkbox" />)

    const checkbox = screen.getByRole("checkbox", { name: "Test checkbox" })
    expect(checkbox).toBeDisabled()

    await userEvent.click(checkbox)
    expect(handleChange).not.toHaveBeenCalled()
  })

  test("applies custom className", () => {
    render(<Checkbox className="custom-class" aria-label="Test checkbox" />)
    const checkbox = screen.getByRole("checkbox", { name: "Test checkbox" })
    expect(checkbox).toHaveClass("custom-class")
  })

  test("renders with a label when wrapped in a label element", () => {
    render(
      <label>
        <Checkbox />
        Checkbox Label
      </label>,
    )

    expect(screen.getByRole("checkbox")).toBeInTheDocument()
    expect(screen.getByText("Checkbox Label")).toBeInTheDocument()
  })

  test("can be checked and unchecked with keyboard", async () => {
    const handleChange = jest.fn()
    render(<Checkbox onCheckedChange={handleChange} aria-label="Test checkbox" />)

    const checkbox = screen.getByRole("checkbox", { name: "Test checkbox" })
    checkbox.focus()

    // Press space to check
    fireEvent.keyDown(checkbox, { key: " " })
    expect(handleChange).toHaveBeenCalledWith(true)

    // Reset mock and simulate unchecking
    handleChange.mockReset()
    fireEvent.keyDown(checkbox, { key: " " })
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Checkbox ref={ref} aria-label="Test checkbox" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})


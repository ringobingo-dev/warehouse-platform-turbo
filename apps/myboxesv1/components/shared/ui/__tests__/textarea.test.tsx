"use client"

import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Textarea } from "../textarea"

describe("Textarea", () => {
  test("renders correctly", () => {
    render(<Textarea />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toBeInTheDocument()
  })

  test("applies custom className", () => {
    render(<Textarea className="custom-class" />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveClass("custom-class")
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe("TEXTAREA")
  })

  test("handles value changes", async () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)

    const textarea = screen.getByRole("textbox")
    await userEvent.type(textarea, "Hello, world!")

    expect(handleChange).toHaveBeenCalled()
    expect(textarea).toHaveValue("Hello, world!")
  })

  test("respects disabled state", () => {
    render(<Textarea disabled />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toBeDisabled()
  })

  test("handles placeholder text", () => {
    render(<Textarea placeholder="Enter text here" />)
    const textarea = screen.getByPlaceholderText("Enter text here")
    expect(textarea).toBeInTheDocument()
  })

  test("respects readonly attribute", () => {
    render(<Textarea readOnly />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveAttribute("readonly")
  })

  test("handles required attribute", () => {
    render(<Textarea required />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toBeRequired()
  })

  test("handles rows attribute", () => {
    render(<Textarea rows={10} />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveAttribute("rows", "10")
  })

  test("handles controlled component behavior", () => {
    const { rerender } = render(<Textarea value="Initial value" readOnly />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveValue("Initial value")

    rerender(<Textarea value="Updated value" readOnly />)
    expect(textarea).toHaveValue("Updated value")
  })
})


"use client"

import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Input } from "../input"

describe("Input component", () => {
  test("renders correctly with default props", () => {
    render(<Input />)
    const input = screen.getByRole("textbox")
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass("flex h-10 w-full rounded-md border")
  })

  test("applies custom className", () => {
    render(<Input className="custom-class" />)
    expect(screen.getByRole("textbox")).toHaveClass("custom-class")
  })

  test("handles value and onChange", () => {
    const handleChange = jest.fn()
    render(<Input value="test" onChange={handleChange} />)

    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("test")

    fireEvent.change(input, { target: { value: "updated" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test("can be disabled", () => {
    render(<Input disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  test("accepts different types", () => {
    const { rerender } = render(<Input type="text" />)
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text")

    rerender(<Input type="email" />)
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email")

    rerender(<Input type="password" />)
    expect(screen.getByLabelText("")).toHaveAttribute("type", "password")
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  test("handles placeholder text", () => {
    render(<Input placeholder="Enter your name" />)
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument()
  })

  test("applies required attribute", () => {
    render(<Input required />)
    expect(screen.getByRole("textbox")).toBeRequired()
  })

  test("applies readonly attribute", () => {
    render(<Input readOnly />)
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly")
  })
})


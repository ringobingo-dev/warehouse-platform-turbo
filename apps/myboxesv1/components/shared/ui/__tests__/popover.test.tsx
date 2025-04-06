"use client"

import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"

describe("Popover", () => {
  test("renders trigger element correctly", () => {
    render(
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>,
    )

    const trigger = screen.getByText("Open popover")
    expect(trigger).toBeInTheDocument()
  })

  test("shows popover content on click", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>,
    )

    const trigger = screen.getByText("Open popover")

    // Popover content should not be visible initially
    expect(screen.queryByText("Popover content")).not.toBeInTheDocument()

    // Click the trigger
    await userEvent.click(trigger)

    // Wait for the popover to appear
    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument()
    })
  })

  test("hides popover content on outside click", async () => {
    render(
      <>
        <div data-testid="outside">Outside element</div>
        <Popover>
          <PopoverTrigger>Open popover</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      </>,
    )

    const trigger = screen.getByText("Open popover")
    const outsideElement = screen.getByTestId("outside")

    // Click the trigger to open the popover
    await userEvent.click(trigger)

    // Wait for the popover to appear
    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument()
    })

    // Click outside the popover
    await userEvent.click(outsideElement)

    // Wait for the popover to disappear
    await waitFor(() => {
      expect(screen.queryByText("Popover content")).not.toBeInTheDocument()
    })
  })

  test("applies custom className to popover content", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent className="custom-popover">Popover content</PopoverContent>
      </Popover>,
    )

    const trigger = screen.getByText("Open popover")

    // Click the trigger
    await userEvent.click(trigger)

    // Wait for the popover to appear and check for the custom class
    await waitFor(() => {
      const popoverContent = screen.getByText("Popover content")
      expect(popoverContent.parentElement).toHaveClass("custom-popover")
    })
  })

  test("supports controlled open state", async () => {
    const TestComponent = () => {
      const [open, setOpen] = React.useState(false)

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger onClick={() => setOpen(true)}>Click me</PopoverTrigger>
          <PopoverContent>Popover content</PopoverContent>
        </Popover>
      )
    }

    render(<TestComponent />)

    // Popover should not be visible initially
    expect(screen.queryByText("Popover content")).not.toBeInTheDocument()

    // Click the trigger to open the popover
    await userEvent.click(screen.getByText("Click me"))

    // Wait for the popover to appear
    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument()
    })
  })

  test("handles nested interactive elements", async () => {
    render(
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>
          <button>Action button</button>
        </PopoverContent>
      </Popover>,
    )

    const trigger = screen.getByText("Open popover")

    // Click the trigger to open the popover
    await userEvent.click(trigger)

    // Wait for the popover to appear
    await waitFor(() => {
      expect(screen.getByText("Action button")).toBeInTheDocument()
    })

    // Click the button inside the popover
    const actionButton = screen.getByText("Action button")
    await userEvent.click(actionButton)

    // Popover should still be open
    expect(screen.getByText("Action button")).toBeInTheDocument()
  })
})


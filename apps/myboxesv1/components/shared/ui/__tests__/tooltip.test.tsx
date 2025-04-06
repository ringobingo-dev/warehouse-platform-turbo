"use client"

import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip"

describe("Tooltip", () => {
  test("renders trigger element correctly", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText("Hover me")
    expect(trigger).toBeInTheDocument()
  })

  test("shows tooltip content on hover", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText("Hover me")

    // Tooltip content should not be visible initially
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument()

    // Hover over the trigger
    await userEvent.hover(trigger)

    // Wait for the tooltip to appear
    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument()
    })
  })

  test("hides tooltip content on unhover", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText("Hover me")

    // Hover over the trigger
    await userEvent.hover(trigger)

    // Wait for the tooltip to appear
    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument()
    })

    // Unhover the trigger
    await userEvent.unhover(trigger)

    // Wait for the tooltip to disappear
    await waitFor(() => {
      expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument()
    })
  })

  test("applies custom className to tooltip content", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-tooltip">Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )

    const trigger = screen.getByText("Hover me")

    // Hover over the trigger
    await userEvent.hover(trigger)

    // Wait for the tooltip to appear and check for the custom class
    await waitFor(() => {
      const tooltipContent = screen.getByText("Tooltip content")
      expect(tooltipContent.parentElement).toHaveClass("custom-tooltip")
    })
  })

  test("supports controlled open state", async () => {
    const TestComponent = () => {
      const [open, setOpen] = React.useState(false)

      return (
        <TooltipProvider>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger onClick={() => setOpen(true)}>Click me</TooltipTrigger>
            <TooltipContent>Tooltip content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    render(<TestComponent />)

    // Tooltip should not be visible initially
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument()

    // Click the trigger to open the tooltip
    await userEvent.click(screen.getByText("Click me"))

    // Wait for the tooltip to appear
    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument()
    })
  })
})


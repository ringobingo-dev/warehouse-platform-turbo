"use client"

import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { Slider } from "../slider"

describe("Slider", () => {
  test("renders correctly", () => {
    render(<Slider />)
    const slider = screen.getByRole("slider")
    expect(slider).toBeInTheDocument()
  })

  test("applies custom className", () => {
    render(<Slider className="custom-slider" />)
    const sliderContainer = screen.getByRole("slider").closest("div")
    expect(sliderContainer).toHaveClass("custom-slider")
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Slider ref={ref} />)
    expect(ref.current).not.toBeNull()
  })

  test("respects default value", () => {
    render(<Slider defaultValue={[50]} />)
    const slider = screen.getByRole("slider")
    expect(slider).toHaveAttribute("aria-valuenow", "50")
  })

  test("respects min and max values", () => {
    render(<Slider min={10} max={90} defaultValue={[50]} />)
    const slider = screen.getByRole("slider")
    expect(slider).toHaveAttribute("aria-valuemin", "10")
    expect(slider).toHaveAttribute("aria-valuemax", "90")
  })

  test("respects step value", () => {
    render(<Slider step={10} defaultValue={[50]} />)
    const slider = screen.getByRole("slider")
    expect(slider).toHaveAttribute("aria-valuenow", "50")
    expect(slider).toHaveAttribute("step", "10")
  })

  test("handles disabled state", () => {
    render(<Slider disabled defaultValue={[50]} />)
    const slider = screen.getByRole("slider")
    expect(slider).toBeDisabled()
  })

  test("supports multiple thumbs", () => {
    render(<Slider defaultValue={[25, 75]} />)
    const sliders = screen.getAllByRole("slider")
    expect(sliders).toHaveLength(2)
    expect(sliders[0]).toHaveAttribute("aria-valuenow", "25")
    expect(sliders[1]).toHaveAttribute("aria-valuenow", "75")
  })

  test("calls onValueChange when value changes", async () => {
    const handleValueChange = jest.fn()
    render(<Slider onValueChange={handleValueChange} defaultValue={[50]} />)

    const slider = screen.getByRole("slider")

    // Simulate keyboard interaction
    fireEvent.keyDown(slider, { key: "ArrowRight" })

    expect(handleValueChange).toHaveBeenCalled()
  })

  test("supports orientation prop", () => {
    render(<Slider orientation="vertical" defaultValue={[50]} />)
    const slider = screen.getByRole("slider")
    expect(slider).toHaveAttribute("aria-orientation", "vertical")
  })

  test("supports inverted direction", () => {
    render(<Slider dir="rtl" defaultValue={[50]} />)
    const slider = screen.getByRole("slider")
    expect(slider.closest("div")).toHaveAttribute("dir", "rtl")
  })
})


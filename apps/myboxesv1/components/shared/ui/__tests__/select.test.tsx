import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../select"

describe("Select component", () => {
  const renderSelect = () => {
    return render(
      <Select defaultValue="apple">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectContent>
      </Select>,
    )
  }

  test("renders with default value", () => {
    renderSelect()
    expect(screen.getByRole("combobox")).toHaveTextContent("Apple")
  })

  test("opens dropdown when clicked", async () => {
    renderSelect()
    const trigger = screen.getByRole("combobox")

    await userEvent.click(trigger)

    // Wait for the dropdown to appear
    await waitFor(() => {
      expect(screen.getByText("Banana")).toBeVisible()
      expect(screen.getByText("Orange")).toBeVisible()
    })
  })

  test("selects a new value when item is clicked", async () => {
    renderSelect()
    const trigger = screen.getByRole("combobox")

    await userEvent.click(trigger)

    // Wait for the dropdown to appear and click an option
    await waitFor(() => {
      const bananaOption = screen.getByText("Banana")
      expect(bananaOption).toBeVisible()
      return bananaOption
    }).then(async (bananaOption) => {
      await userEvent.click(bananaOption)
    })

    // Check that the selected value has updated
    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveTextContent("Banana")
    })
  })

  test("closes dropdown when item is selected", async () => {
    renderSelect()
    const trigger = screen.getByRole("combobox")

    await userEvent.click(trigger)

    // Wait for the dropdown to appear and click an option
    await waitFor(() => {
      const orangeOption = screen.getByText("Orange")
      expect(orangeOption).toBeVisible()
      return orangeOption
    }).then(async (orangeOption) => {
      await userEvent.click(orangeOption)
    })

    // Check that the dropdown has closed
    await waitFor(() => {
      expect(screen.queryByText("Banana")).not.toBeVisible()
    })
  })

  test("handles disabled state", () => {
    render(
      <Select disabled>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByRole("combobox")).toBeDisabled()
  })

  test("shows placeholder when no value is selected", () => {
    render(
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(screen.getByRole("combobox")).toHaveTextContent("Select a fruit")
  })
})


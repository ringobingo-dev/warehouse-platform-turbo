"use client"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs"

describe("Tabs component", () => {
  const renderTabs = () => {
    return render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3" disabled>
            Tab 3
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
        <TabsContent value="tab3">Tab 3 content</TabsContent>
      </Tabs>,
    )
  }

  test("renders with default tab selected", () => {
    renderTabs()

    // Check that the first tab is selected
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("data-state", "active")
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("data-state", "inactive")

    // Check that the first tab content is visible
    expect(screen.getByText("Tab 1 content")).toBeVisible()
    expect(screen.queryByText("Tab 2 content")).not.toBeVisible()
  })

  test("switches tabs when clicking on a tab", async () => {
    renderTabs()

    // Click on the second tab
    const tab2 = screen.getByRole("tab", { name: "Tab 2" })
    await userEvent.click(tab2)

    // Check that the second tab is now selected
    expect(tab2).toHaveAttribute("data-state", "active")
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("data-state", "inactive")

    // Check that the second tab content is now visible
    expect(screen.getByText("Tab 2 content")).toBeVisible()
    expect(screen.queryByText("Tab 1 content")).not.toBeVisible()
  })

  test("disabled tab cannot be selected", async () => {
    renderTabs()

    // Try to click on the disabled tab
    const tab3 = screen.getByRole("tab", { name: "Tab 3" })
    expect(tab3).toBeDisabled()

    await userEvent.click(tab3)

    // Check that the first tab is still selected
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("data-state", "active")
    expect(tab3).toHaveAttribute("data-state", "inactive")

    // Check that the first tab content is still visible
    expect(screen.getByText("Tab 1 content")).toBeVisible()
    expect(screen.queryByText("Tab 3 content")).not.toBeVisible()
  })

  test("can be controlled with value prop", () => {
    const { rerender } = render(
      <Tabs value="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>,
    )

    // Check that the first tab is selected
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("data-state", "active")
    expect(screen.getByText("Tab 1 content")).toBeVisible()

    // Change the value prop
    rerender(
      <Tabs value="tab2">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>,
    )

    // Check that the second tab is now selected
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("data-state", "active")
    expect(screen.getByText("Tab 2 content")).toBeVisible()
  })

  test("calls onValueChange when tab is changed", async () => {
    const handleValueChange = jest.fn()
    render(
      <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Tab 1 content</TabsContent>
        <TabsContent value="tab2">Tab 2 content</TabsContent>
      </Tabs>,
    )

    // Click on the second tab
    const tab2 = screen.getByRole("tab", { name: "Tab 2" })
    await userEvent.click(tab2)

    // Check that onValueChange was called with the correct value
    expect(handleValueChange).toHaveBeenCalledWith("tab2")
  })

  test("applies custom className to components", () => {
    render(
      <Tabs defaultValue="tab1" className="tabs-custom">
        <TabsList className="tabs-list-custom">
          <TabsTrigger value="tab1" className="trigger-custom">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="content-custom">
          Content
        </TabsContent>
      </Tabs>,
    )

    expect(screen.getByRole("tablist")).toHaveClass("tabs-list-custom")
    expect(screen.getByRole("tab")).toHaveClass("trigger-custom")
    expect(screen.getByText("Content").parentElement).toHaveClass("content-custom")
  })
})


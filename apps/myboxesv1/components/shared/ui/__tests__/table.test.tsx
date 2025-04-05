import { render, screen } from "@testing-library/react"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../table"

describe("Table", () => {
  test("renders basic table correctly", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    // Check header cells
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()

    // Check data cells
    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("john@example.com")).toBeInTheDocument()
    expect(screen.getByText("Jane Smith")).toBeInTheDocument()
    expect(screen.getByText("jane@example.com")).toBeInTheDocument()
  })

  test("renders table with caption", () => {
    render(
      <Table>
        <TableCaption>List of users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    expect(screen.getByText("List of users")).toBeInTheDocument()
  })

  test("renders table with footer", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer content</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )

    expect(screen.getByText("Footer content")).toBeInTheDocument()
  })

  test("applies custom className to table", () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const table = screen.getByRole("table")
    expect(table).toHaveClass("custom-table")
  })

  test("applies custom className to table header", () => {
    render(
      <Table>
        <TableHeader className="custom-header">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const thead = document.querySelector("thead")
    expect(thead).toHaveClass("custom-header")
  })

  test("applies custom className to table row", () => {
    render(
      <Table>
        <TableBody>
          <TableRow className="custom-row">
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const row = document.querySelector("tr")
    expect(row).toHaveClass("custom-row")
  })

  test("applies custom className to table cell", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="custom-cell">Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const cell = screen.getByText("Content").closest("td")
    expect(cell).toHaveClass("custom-cell")
  })

  test("supports colSpan on table cells", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>Spans two columns</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    )

    const cell = screen.getByText("Spans two columns").closest("td")
    expect(cell).toHaveAttribute("colspan", "2")
  })
})


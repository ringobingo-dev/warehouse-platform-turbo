"use client"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../dialog"

describe('Dialog component', () => {
  test('dialog is closed by default', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog content</p>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    
    expect(screen.getByText('Open Dialog')).toBeInTheDocument()
    expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
  })

  test('opens dialog when trigger is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <p>Dialog content</p>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogContent>
      </Dialog>
    )
    
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
      expect(screen.getByText('Dialog Description')).toBeInTheDocument()
      expect(screen.getByText('Dialog content')).toBeInTheDocument()
      expect(screen.getByText('Close')).toBeInTheDocument()
    })
  })

  test('closes dialog when close button is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    
    // Open the dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    })
    
    // Click close button
    const closeButton = screen.getByText('Close')
    await userEvent.click(closeButton)
    
    // Wait for dialog to disappear
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
    })
  })

  test('closes dialog when clicking outside', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    
    // Open the dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument()
    })
    
    // Click outside the dialog (on the backdrop)
    const backdrop = document.querySelector('[data-state="open"]') as HTMLElement
    if (backdrop) {
      await userEvent.click(backdrop)
    }
    
    // Wait for dialog to disappear
    await waitFor(() => {
      expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument()
    })
  })

  test('can be controlled with open prop', async () => {
    const TestComponent = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>External Open</button>
          <button onClick={() => setOpen(false)}>External Close</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogTitle>Controlled Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );
    };
    
    render(<TestComponent />);
    
    // Dialog should be closed initially
    expect(screen.queryByText('Controlled Dialog')).not.toBeInTheDocument();
    
    // Open dialog with external control
    await userEvent.click(screen.getByText('External Open'));
    
    // Wait for dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
    });
    
    // Close dialog with external control
    await userEvent.click(screen.getByText('External Close'));
    
    // Wait for dialog to disappear
    await waitFor(() => {
      expect(screen.queryByText('Controlled Dialog')).not.toBeInTheDocument();
    });
  })
})


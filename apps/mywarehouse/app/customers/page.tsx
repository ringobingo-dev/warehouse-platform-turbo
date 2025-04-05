"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Trash2 } from "lucide-react"
import { NewCustomerModule } from "@/components/NewCustomerModule"
import { UserInviteModule } from "@/components/UserInviteModule"

interface Customer {
  customer_id: string
  email: string
  company_name: string
  view: string
  handling_charge: number
  bin_charge: number
  function: string
  address: string
  first_name: string
  last_name: string
  phone_number: string
  postcode: string
  type: string
}

interface User {
  user_id: string
  customer_id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      customer_id: "1",
      email: "john@example.com",
      company_name: "ABC Corp",
      view: "Full",
      handling_charge: 10,
      bin_charge: 5,
      function: "Storage",
      address: "123 Main St",
      first_name: "John",
      last_name: "Doe",
      phone_number: "555-1234",
      postcode: "12345",
      type: "warehouseOwner",
    },
    {
      customer_id: "2",
      email: "jane@example.com",
      company_name: "XYZ Ltd",
      view: "Limited",
      handling_charge: 12,
      bin_charge: 6,
      function: "Distribution",
      address: "456 Oak Ave",
      first_name: "Jane",
      last_name: "Doe",
      phone_number: "555-5678",
      postcode: "67890",
      type: "roomRenter",
    },
  ])

  const [users, setUsers] = useState<User[]>([
    {
      user_id: "U1",
      customer_id: "1",
      email: "user1@abccorp.com",
      first_name: "Alice",
      last_name: "Smith",
      role: "Logistics",
    },
    {
      user_id: "U2",
      customer_id: "2",
      email: "user2@xyzltd.com",
      first_name: "Bob",
      last_name: "Johnson",
      role: "Admin",
    },
  ])

  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    email: "",
    company_name: "",
  })

  const [newUser, setNewUser] = useState<Partial<User>>({
    email: "",
    customer_id: "",
    first_name: "",
    last_name: "",
    role: "",
  })

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleInviteCustomer = (customerData: { name: string; type: string; email: string }) => {
    const newCustomerId = `C${customers.length + 1}`
    const newCustomer: Customer = {
      customer_id: newCustomerId,
      email: customerData.email,
      company_name: customerData.name,
      view: "Limited",
      handling_charge: 0,
      bin_charge: 0,
      function: "Pending",
      address: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      postcode: "",
      type: customerData.type,
    }
    setCustomers([...customers, newCustomer])
  }

  const inviteUser = () => {
    if (newUser.email && newUser.customer_id && newUser.first_name && newUser.last_name && newUser.role) {
      const user: User = {
        user_id: `U${users.length + 1}`,
        ...(newUser as User),
      }
      setUsers([...users, user])
      setNewUser({ email: "", customer_id: "", first_name: "", last_name: "", role: "" })
      // TODO: Implement actual email sending logic
      alert(`Invitation email sent to ${user.email} for account creation`)
    }
  }

  const editCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
  }

  const editUser = (user: User) => {
    setEditingUser(user)
  }

  const updateCustomer = () => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.customer_id === editingCustomer.customer_id ? editingCustomer : c)))
      setEditingCustomer(null)
    }
  }

  const updateUser = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.user_id === editingUser.user_id ? editingUser : u)))
      setEditingUser(null)
    }
  }

  const removeCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.customer_id !== id))
    // Also remove associated users
    setUsers(users.filter((u) => u.customer_id !== id))
  }

  const removeUser = (id: string) => {
    setUsers(users.filter((u) => u.user_id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer and User Management</h1>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <div className="mb-4">
            <NewCustomerModule onInvite={handleInviteCustomer} />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Handling Charge</TableHead>
                  <TableHead>Bin Charge</TableHead>
                  <TableHead>Function</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.customer_id}>
                    <TableCell className="font-medium">{customer.company_name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.type}</TableCell>
                    <TableCell>
                      {editingCustomer?.customer_id === customer.customer_id ? (
                        <Input
                          value={editingCustomer.view}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, view: e.target.value })}
                        />
                      ) : (
                        customer.view
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCustomer?.customer_id === customer.customer_id ? (
                        <Input
                          type="number"
                          value={editingCustomer.handling_charge}
                          onChange={(e) =>
                            setEditingCustomer({ ...editingCustomer, handling_charge: Number(e.target.value) })
                          }
                        />
                      ) : (
                        customer.handling_charge
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCustomer?.customer_id === customer.customer_id ? (
                        <Input
                          type="number"
                          value={editingCustomer.bin_charge}
                          onChange={(e) =>
                            setEditingCustomer({ ...editingCustomer, bin_charge: Number(e.target.value) })
                          }
                        />
                      ) : (
                        customer.bin_charge
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCustomer?.customer_id === customer.customer_id ? (
                        <Input
                          value={editingCustomer.function}
                          onChange={(e) => setEditingCustomer({ ...editingCustomer, function: e.target.value })}
                        />
                      ) : (
                        customer.function
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCustomer?.customer_id === customer.customer_id ? (
                        <Button onClick={updateCustomer}>Save</Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => editCustomer(customer)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => removeCustomer(customer.customer_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="mb-4">
            <UserInviteModule onInvite={inviteUser} />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.customer_id}</TableCell>
                    <TableCell>
                      {editingUser?.user_id === user.user_id ? (
                        <Input
                          value={editingUser.first_name}
                          onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                        />
                      ) : (
                        user.first_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser?.user_id === user.user_id ? (
                        <Input
                          value={editingUser.last_name}
                          onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                        />
                      ) : (
                        user.last_name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser?.user_id === user.user_id ? (
                        <Input
                          value={editingUser.role}
                          onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        />
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUser?.user_id === user.user_id ? (
                        <Button onClick={updateUser}>Save</Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => editUser(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => removeUser(user.user_id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


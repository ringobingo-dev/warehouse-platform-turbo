export const warehouseProfile = {
  name: "Mountain Storage Solutions",
  address: "1250 Alpine Way",
  zip: "83301",
  city: "Twin Falls",
  state: "Idaho",
  country: "New Zealand",
  email: "billing@mountainstorage.com",
  phone: "+1 (208) 555-7890",
  taxId: "82-1234567",
  logo: "/placeholder.svg?height=100&width=200",
  bankDetails: {
    bankName: "First National Bank",
    accountName: "Mountain Storage Solutions LLC",
    accountNumber: "9876543210",
    routingNumber: "087654321",
    swiftCode: "FNBUS12345",
  },
}

export const mockCustomers = [
  {
    id: "cust-001",
    type: "type2",
    name: "Harvest Valley Farms",
    address: "4578 Orchard Lane",
    zip: "83686",
    city: "Nampa",
    state: "Idaho",
    country: "New Zealand",
    email: "accounts@harvestvalley.com",
    phone: "+1 (208) 555-4321",
    contactPerson: "Sarah Johnson",
    notes: "Stores seasonal produce and equipment",
  },
  {
    id: "cust-002",
    type: "type1",
    name: "TechStore Solutions",
    address: "789 Innovation Drive",
    zip: "83702",
    city: "Boise",
    state: "Idaho",
    country: "New Zealand",
    email: "billing@techstore.com",
    phone: "+1 (208) 555-9876",
    contactPerson: "Michael Chen",
    notes: "Stores electronic inventory and packaging materials",
  },
]

// Get the first type2 customer
export const firstType2Customer = mockCustomers.find((customer) => customer.type === "type2")


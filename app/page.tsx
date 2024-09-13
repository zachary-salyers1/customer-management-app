'use client'

import { useState } from 'react'
import { CustomerForm } from "@/components/customer-form"

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([])

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prevCustomers => [...prevCustomers, customer])
    console.log('New customer added:', customer)
  }

  return (
    <div className="container mx-auto p-4">
      <CustomerForm onAddCustomer={handleAddCustomer} />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Customer List</h2>
        {customers.length === 0 ? (
          <p>No customers added yet.</p>
        ) : (
          <ul className="space-y-2">
            {customers.map(customer => (
              <li key={customer.id} className="border p-2 rounded">
                <strong>{customer.name}</strong> - {customer.email} - {customer.phone}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
'use client'

import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"  // Update this line

type CustomerFormProps = {
  onAddCustomer: (customer: Customer) => void;
};

export function CustomerForm({ onAddCustomer }: CustomerFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newCustomer: Customer = { 
      id: Date.now(), 
      name, 
      email, 
      phone,
      projects: []
    }
    console.log('Submitting new customer:', newCustomer)
    onAddCustomer(newCustomer)
    setName('')
    setEmail('')
    setPhone('')
    toast({
      title: "Customer Added",
      description: `${name} has been added successfully.`,
    })
    console.log('Form reset, customer should be added')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Customer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Customer</Button>
        </form>
      </CardContent>
    </Card>
  )
}
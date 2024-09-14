'use client'

import { useState, FormEvent, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Customer } from '@/types'

type CustomerFormProps = {
  onSubmitCustomer: (customer: Omit<Customer, 'id' | 'userId' | 'projects'>) => void;
  initialCustomer?: Customer;
};

export function CustomerForm({ onSubmitCustomer, initialCustomer }: CustomerFormProps) {
  const [name, setName] = useState(initialCustomer?.name || '')
  const [companyName, setCompanyName] = useState(initialCustomer?.companyName || '')
  const [email, setEmail] = useState(initialCustomer?.email || '')
  const [phone, setPhone] = useState(initialCustomer?.phone || '')
  const [jobTitle, setJobTitle] = useState(initialCustomer?.jobTitle || '')
  const [leadType, setLeadType] = useState<'cold' | 'warm' | 'hot'>(initialCustomer?.leadType || 'cold')
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>(initialCustomer?.customFields || {})
  const [newFieldName, setNewFieldName] = useState('')

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name)
      setCompanyName(initialCustomer.companyName)
      setEmail(initialCustomer.email)
      setPhone(initialCustomer.phone)
      setJobTitle(initialCustomer.jobTitle)
      setLeadType(initialCustomer.leadType)
      setCustomFields(initialCustomer.customFields)
    }
  }, [initialCustomer])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const customerData: Omit<Customer, 'id' | 'userId' | 'projects'> = {
      name,
      companyName,
      email,
      phone,
      jobTitle,
      leadType,
      customFields
    }
    onSubmitCustomer(customerData)
    if (!initialCustomer) {
      // Reset form fields only if adding a new customer
      setName('')
      setCompanyName('')
      setEmail('')
      setPhone('')
      setJobTitle('')
      setLeadType('cold')
      setCustomFields({})
    }
    toast({
      title: initialCustomer ? "Customer Updated" : "Customer Added",
      description: `${name} from ${companyName} has been ${initialCustomer ? 'updated' : 'added'} successfully.`,
    })
  }

  const handleAddCustomField = () => {
    if (newFieldName && !customFields[newFieldName]) {
      setCustomFields({ ...customFields, [newFieldName]: '' })
      setNewFieldName('')
    }
  }

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setCustomFields({ ...customFields, [fieldName]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialCustomer ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
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
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="leadType">Lead Type</Label>
            <Select onValueChange={(value: 'cold' | 'warm' | 'hot') => setLeadType(value)} value={leadType}>
              <SelectTrigger>
                <SelectValue placeholder="Select lead type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="warm">Warm</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Custom Fields */}
          {Object.entries(customFields).map(([fieldName, fieldValue]) => (
            <div key={fieldName}>
              <Label htmlFor={fieldName}>{fieldName}</Label>
              <Input
                id={fieldName}
                value={fieldValue}
                onChange={(e) => handleCustomFieldChange(fieldName, e.target.value)}
              />
            </div>
          ))}
          {/* Add New Custom Field */}
          <div className="flex space-x-2">
            <Input
              placeholder="New Field Name"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
            />
            <Button type="button" onClick={handleAddCustomField}>Add Field</Button>
          </div>
          <Button type="submit">{initialCustomer ? 'Update Customer' : 'Add Customer'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
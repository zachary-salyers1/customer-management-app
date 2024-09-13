'use client'

import { useState } from 'react'
import { CustomerForm } from "@/components/customer-form"
import { ProjectForm } from "@/components/project-form"
import { TaskForm } from "@/components/task-form"
import { TaskDashboard } from "@/components/task-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  projects: Project[];
}

type Project = {
  id: number;
  name: string;
  description: string;
  tasks: Task[];
}

type Task = {
  id: number;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [expandedCustomer, setExpandedCustomer] = useState<number | null>(null)
  const [expandedProject, setExpandedProject] = useState<{customerId: number, projectId: number} | null>(null)

  const handleAddCustomer = (customer: Customer) => {
    setCustomers(prevCustomers => [...prevCustomers, customer])
  }

  const handleAddProject = (customerId: number, project: Project) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, projects: [...customer.projects, project] }
        : customer
    ))
  }

  const handleAddTask = (customerId: number, projectId: number, task: Task) => {
    setCustomers(customers.map(customer => 
      customer.id === customerId
        ? {
            ...customer,
            projects: customer.projects.map(project =>
              project.id === projectId
                ? { ...project, tasks: [...project.tasks, task] }
                : project
            )
          }
        : customer
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="customers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers">Customers & Projects</TabsTrigger>
          <TabsTrigger value="dashboard">Task Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <CustomerForm onAddCustomer={handleAddCustomer} />
          <div className="mt-8 space-y-4">
            {customers.map(customer => (
              <Card key={customer.id} className="w-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{customer.name}</span>
                    <Button
                      onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                      variant="outline"
                    >
                      {expandedCustomer === customer.id ? 'Collapse' : 'Expand'}
                    </Button>
                  </CardTitle>
                  <p>{customer.email} - {customer.phone}</p>
                </CardHeader>
                {expandedCustomer === customer.id && (
                  <CardContent>
                    <ProjectForm onAddProject={(project) => handleAddProject(customer.id, project)} customerId={customer.id} />
                    <div className="mt-4 space-y-4">
                      {customer.projects.map(project => (
                        <Card key={project.id}>
                          <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                              <span>{project.name}</span>
                              <Button
                                onClick={() => setExpandedProject(
                                  expandedProject?.customerId === customer.id && expandedProject?.projectId === project.id
                                    ? null
                                    : { customerId: customer.id, projectId: project.id }
                                )}
                                variant="outline"
                                size="sm"
                              >
                                {expandedProject?.customerId === customer.id && expandedProject?.projectId === project.id ? 'Collapse' : 'Expand'}
                              </Button>
                            </CardTitle>
                            <p>{project.description}</p>
                          </CardHeader>
                          {expandedProject?.customerId === customer.id && expandedProject?.projectId === project.id && (
                            <CardContent>
                              <TaskForm onAddTask={(task) => handleAddTask(customer.id, project.id, task)} projectId={project.id} />
                              <ul className="mt-4 space-y-2">
                                {project.tasks.map(task => (
                                  <li key={task.id} className="border p-2 rounded">
                                    <strong>{task.name}</strong> - {task.description} (Status: {task.status})
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="dashboard">
          <TaskDashboard customers={customers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
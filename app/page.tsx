'use client'

import { useAuth } from '@/contexts/AuthContext';
import { SignIn } from '@/components/SignIn';
import { useState, useEffect, useRef } from 'react'
import { CustomerForm } from "@/components/customer-form"
import { ProjectForm } from "@/components/project-form"
import { TaskForm } from "@/components/task-form"
import { TaskDashboard } from "@/components/task-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getCustomers, getProjects, getTasks, addCustomer, updateCustomer, addProject, addTask, updateTaskStatus, updateTask, deleteTask } from '@/lib/db'
import { toast } from "@/hooks/use-toast"
import { auth } from '@/lib/firebase'
import { Customer, Project, Task } from '@/types'

export default function Page() {
  const { user, loading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([])
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null)
  const [expandedProject, setExpandedProject] = useState<{customerId: string, projectId: string} | null>(null)
  const loggedRef = useRef(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    if (!loading && user) {
      fetchCustomers();
    }
  }, [user, loading]);

  const fetchCustomers = async () => {
    if (user) {
      try {
        const fetchedCustomers = await getCustomers(user.uid);
        console.log('Fetched customers:', fetchedCustomers);
        const customersWithProjectsAndTasks = await Promise.all(
          fetchedCustomers.map(async (customer) => {
            const projects = await getProjects(customer.id);
            const projectsWithTasks = await Promise.all(
              projects.map(async (project) => {
                const tasks = await getTasks(project.id);
                return { ...project, tasks };
              })
            );
            return { ...customer, projects: projectsWithTasks };
          })
        );
        setCustomers(customersWithProjectsAndTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddCustomer = async (customer: Omit<Customer, 'id' | 'userId' | 'projects'>) => {
    if (user) {
      try {
        const newCustomer = await addCustomer({ ...customer, userId: user.uid });
        setCustomers(prevCustomers => [...prevCustomers, { ...newCustomer, projects: [] }]);
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
      } catch (error) {
        console.error('Error adding customer:', error);
        toast({
          title: "Error",
          description: "Failed to add customer. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      console.error('User is not authenticated');
      toast({
        title: "Error",
        description: "You must be logged in to add a customer.",
        variant: "destructive",
      });
    }
  }

  const handleUpdateCustomer = async (updatedCustomer: Omit<Customer, 'id' | 'userId' | 'projects'>) => {
    if (editingCustomer && user) {
      try {
        await updateCustomer(editingCustomer.id, updatedCustomer);
        setCustomers(prevCustomers => prevCustomers.map(customer => 
          customer.id === editingCustomer.id ? { ...customer, ...updatedCustomer } : customer
        ));
        setEditingCustomer(null);
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      } catch (error) {
        console.error('Error updating customer:', error);
        toast({
          title: "Error",
          description: "Failed to update customer. Please try again.",
          variant: "destructive",
        });
      }
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
  }

  const handleAddProject = async (customerId: string, project: Omit<Project, 'id'>) => {
    const newProject = await addProject({ ...project, customerId });
    setCustomers(customers.map(customer => 
      customer.id === customerId 
        ? { ...customer, projects: [...customer.projects, { ...newProject, tasks: [] }] }
        : customer
    ));
  }

  const handleAddTask = async (customerId: string, projectId: string, task: Omit<Task, 'id'>) => {
    const newTask = await addTask({ ...task, projectId });
    setCustomers(customers.map(customer => 
      customer.id === customerId
        ? {
            ...customer,
            projects: customer.projects.map(project =>
              project.id === projectId
                ? { ...project, tasks: [...project.tasks, newTask] }
                : project
            )
          }
        : customer
    ));
  }

  const handleUpdateTaskStatus = async (task: Task) => {
    try {
      // Update the task status to 'completed' in Firestore
      await updateTaskStatus(task.id, 'completed');
      // Update the local state
      setCustomers(prevCustomers =>
        prevCustomers.map(customer =>
          customer.id === task.customerId
            ? {
                ...customer,
                projects: customer.projects.map(project =>
                  project.id === task.projectId
                    ? {
                        ...project,
                        tasks: project.tasks.map(t =>
                          t.id === task.id ? { ...t, status: 'completed' } : t
                        )
                      }
                    : project
                )
              }
            : customer
        )
      );
      toast({
        title: "Task Completed",
        description: `Task "${task.name}" marked as completed.`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      await updateTask(taskId, updatedTask);
      setCustomers(prevCustomers =>
        prevCustomers.map(customer => ({
          ...customer,
          projects: customer.projects.map(project => ({
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, ...updatedTask } : task
            )
          }))
        }))
      );
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setCustomers(prevCustomers =>
        prevCustomers.map(customer => ({
          ...customer,
          projects: customer.projects.map(project => ({
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId)
          }))
        }))
      );
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!loggedRef.current) {
      console.log('Auth state:', { user, loading });
      loggedRef.current = true;
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <SignIn />;
  }

  return (
    <div className="container mx-auto p-4">
      <Button onClick={handleSignOut}>Sign Out</Button>
      <Tabs defaultValue="customers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="dashboard">Task Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <CustomerForm onSubmitCustomer={handleAddCustomer} />
          <div className="mt-8 space-y-4">
            {customers.map(customer => (
              <Card key={customer.id} className="w-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{customer.name}</span>
                    <div>
                      <Button
                        onClick={() => handleEditCustomer(customer)}
                        variant="outline"
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                        variant="outline"
                      >
                        {expandedCustomer === customer.id ? 'Collapse' : 'Expand'}
                      </Button>
                    </div>
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    <p>Company: {customer.companyName}</p>
                    <p>Email: {customer.email}</p>
                    <p>Phone: {customer.phone}</p>
                    <p>Job Title: {customer.jobTitle}</p>
                    <p>Lead Type: {customer.leadType}</p>
                    {Object.entries(customer.customFields).map(([fieldName, fieldValue]) => (
                      <p key={fieldName}>{fieldName}: {fieldValue}</p>
                    ))}
                  </div>
                </CardHeader>
                {expandedCustomer === customer.id && (
                  <CardContent>
                    <p>Projects: {customer.projects.length}</p>
                    <p>Total Tasks: {customer.projects.reduce((sum, project) => sum + project.tasks.length, 0)}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="projects">
          <div className="space-y-4">
            {customers.map(customer => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle>{customer.name}'s Projects</CardTitle>
                </CardHeader>
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
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="dashboard">
          <TaskDashboard
            customers={customers}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>
      </Tabs>
      
      {editingCustomer && (
        <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSubmitCustomer={handleUpdateCustomer}
              initialCustomer={editingCustomer}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
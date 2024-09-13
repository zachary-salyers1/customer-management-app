import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

type ProjectFormProps = {
  onAddProject: (project: Omit<Project, 'id'>) => void;
  customerId: string;
};

export function ProjectForm({ onAddProject, customerId }: ProjectFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newProject: Omit<Project, 'id'> = {
      name,
      description,
      customerId
    }
    onAddProject(newProject)
    setName('')
    setDescription('')
    toast({
      title: "Project Added",
      description: `${name} has been added successfully.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="projectDescription">Description</Label>
            <Input
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Add Project</Button>
        </form>
      </CardContent>
    </Card>
  )
}
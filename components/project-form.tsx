import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

type ProjectFormProps = {
  onAddProject: (project: Project) => void;
  customerId: number;
};

export function ProjectForm({ onAddProject, customerId }: ProjectFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newProject: Project = {
      id: Date.now(),
      name,
      description,
      tasks: []
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
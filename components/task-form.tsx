import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

type TaskFormProps = {
  onAddTask: (task: Task) => void;
  projectId: number;
};

export function TaskForm({ onAddTask, projectId }: TaskFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newTask: Task = {
      id: Date.now(),
      name,
      description,
      status: 'todo',
      priority
    }
    onAddTask(newTask)
    setName('')
    setDescription('')
    setPriority('medium')
    toast({
      title: "Task Added",
      description: `${name} has been added successfully.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="taskDescription">Description</Label>
            <Input
              id="taskDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="taskPriority">Priority</Label>
            <Select onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)} value={priority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Task</Button>
        </form>
      </CardContent>
    </Card>
  )
}
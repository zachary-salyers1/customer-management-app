import { useState, FormEvent, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea" // Add this import

type TaskFormProps = {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  projectId: string;
  initialTask?: Task;
};

export function TaskForm({ onAddTask, projectId, initialTask }: TaskFormProps) {
  const [name, setName] = useState(initialTask?.name || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask?.priority || 'medium')
  const [notes, setNotes] = useState(initialTask?.notes || '')
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'completed'>(initialTask?.status || 'todo')

  useEffect(() => {
    if (initialTask) {
      setName(initialTask.name)
      setDescription(initialTask.description)
      setPriority(initialTask.priority)
      setNotes(initialTask.notes)
      setStatus(initialTask.status)
    }
  }, [initialTask])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const task: Omit<Task, 'id'> = {
      name,
      description,
      status,
      priority,
      projectId,
      notes
    }
    onAddTask(task)
    if (!initialTask) {
      setName('')
      setDescription('')
      setPriority('medium')
      setNotes('')
      setStatus('todo')
    }
    toast({
      title: initialTask ? "Task Updated" : "Task Added",
      description: `${name} has been ${initialTask ? 'updated' : 'added'} successfully.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialTask ? 'Edit Task' : 'Add New Task'}</CardTitle>
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
          <div>
            <Label htmlFor="taskNotes">Notes</Label>
            <Textarea
              id="taskNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes here..."
            />
          </div>
          <div>
            <Label htmlFor="taskStatus">Status</Label>
            <Select onValueChange={(value: 'todo' | 'in-progress' | 'completed') => setStatus(value)} value={status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">{initialTask ? 'Update Task' : 'Add Task'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}
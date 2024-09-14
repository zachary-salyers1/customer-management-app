import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TaskForm } from "@/components/task-form"
import { toast } from "@/hooks/use-toast"

type DashboardProps = {
  customers: Customer[]
  onUpdateTaskStatus: (task: Task) => void
  onUpdateTask: (taskId: string, updatedTask: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskDashboard({ customers, onUpdateTaskStatus, onUpdateTask, onDeleteTask }: DashboardProps) {
  const [isCompletedTasksOpen, setIsCompletedTasksOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const allTasks = customers.flatMap(customer =>
    customer.projects.flatMap(project =>
      project.tasks.map(task => ({
        ...task,
        projectName: project.name,
        customerName: customer.name,
        customerId: customer.id,
        projectId: project.id,
      }))
    )
  )

  const incompleteTasks = allTasks.filter(task => task.status !== 'completed')
  const completedTasks = allTasks.filter(task => task.status === 'completed')

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleUpdateTask = (updatedTask: Omit<Task, 'id'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, updatedTask)
      setEditingTask(null)
      toast({
        title: "Task Updated",
        description: `${updatedTask.name} has been updated successfully.`,
      })
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDeleteTask(taskId)
      toast({
        title: "Task Deleted",
        description: "The task has been deleted successfully.",
      })
    }
  }

  const renderTaskCard = (task: Task, isCompleted: boolean) => (
    <Card key={task.id} className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {!isCompleted && (
            <Checkbox
              checked={false}
              onCheckedChange={() => onUpdateTaskStatus(task)}
              id={task.id}
              aria-label={`Mark ${task.name} as completed`}
            />
          )}
          <div className={`${!isCompleted ? 'ml-4' : ''}`}>
            <h3 className="font-bold">{task.name}</h3>
            <p className="text-sm text-gray-500">{task.description}</p>
            {task.notes && (
              <p className="text-xs text-gray-400 mt-1">
                Notes: {task.notes}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Project: {task.projectName} | Customer: {task.customerName}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge
            variant={
              task.status === 'completed' ? 'default' :
              task.status === 'in-progress' ? 'secondary' : 'outline'
            }
          >
            {task.status}
          </Badge>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
        </div>
      </div>
    </Card>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Task Dashboard
          <Dialog open={isCompletedTasksOpen} onOpenChange={setIsCompletedTasksOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Completed Tasks ({completedTasks.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Completed Tasks</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {completedTasks.map(task => renderTaskCard(task, true))}
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {incompleteTasks.map(task => renderTaskCard(task, false))}
        </div>
      </CardContent>
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              onAddTask={handleUpdateTask}
              projectId={editingTask.projectId}
              initialTask={editingTask}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
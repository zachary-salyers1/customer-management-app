import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type DashboardProps = {
  customers: Customer[]
}

export function TaskDashboard({ customers }: DashboardProps) {
  const allTasks = customers.flatMap(customer =>
    customer.projects.flatMap(project =>
      project.tasks.map(task => ({
        ...task,
        projectName: project.name,
        customerName: customer.name
      }))
    )
  )

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allTasks.map(task => (
            <Card key={task.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{task.name}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Project: {task.projectName} | Customer: {task.customerName}
                  </p>
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
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
export type Customer = {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  jobTitle: string;
  leadType: 'cold' | 'warm' | 'hot';
  userId: string;
  customFields: { [key: string]: string };
  projects: Project[];
}

export type Project = {
  id: string;
  name: string;
  description: string;
  customerId: string;
  tasks: Task[];
}

export type Task = {
  id: string;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  notes: string;
}
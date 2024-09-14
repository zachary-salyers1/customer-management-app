import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { Customer, Project, Task } from '@/types';

export async function addCustomer(customer: Omit<Customer, 'id'>) {
  const docRef = await addDoc(collection(db, 'customers'), {
    ...customer,
    customFields: customer.customFields || {}
  });
  return { id: docRef.id, ...customer };
}

export async function getCustomers(userId: string) {
  try {
    const q = query(collection(db, 'customers'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        customFields: data.customFields || {},
      } as Customer;
    });
  } catch (error) {
    console.error('Error in getCustomers:', error);
    throw error;
  }
}

export async function addProject(project: Omit<Project, 'id'>) {
  const docRef = await addDoc(collection(db, 'projects'), project);
  return { id: docRef.id, ...project };
}

export async function getProjects(customerId: string) {
  const q = query(collection(db, 'projects'), where('customerId', '==', customerId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function addTask(task: Omit<Task, 'id'>) {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    notes: task.notes || '' // Add this line
  });
  return { id: docRef.id, ...task };
}

export async function getTasks(projectId: string) {
  const q = query(collection(db, 'tasks'), where('projectId', '==', projectId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
}

export async function updateTaskStatus(taskId: string, status: string) {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { status });
}

export async function updateTask(taskId: string, updatedTask: Partial<Task>) {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, updatedTask);
}

export async function deleteTask(taskId: string) {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
}

export async function updateCustomer(customerId: string, updatedCustomer: Partial<Customer>) {
  const customerRef = doc(db, 'customers', customerId);
  await updateDoc(customerRef, updatedCustomer);
}

// ... Add more functions for updating and deleting as needed
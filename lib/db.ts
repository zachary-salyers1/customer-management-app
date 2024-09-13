import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { Customer, Project, Task } from '@/types';

export async function addCustomer(customer: Omit<Customer, 'id'>) {
  const docRef = await addDoc(collection(db, 'customers'), customer);
  return { id: docRef.id, ...customer };
}

export async function getCustomers(userId: string) {
  try {
    const q = query(collection(db, 'customers'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
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
  const docRef = await addDoc(collection(db, 'tasks'), task);
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

// ... Add more functions for updating and deleting as needed
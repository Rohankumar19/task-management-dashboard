import { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: Date;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (newTask: Omit<Task, '_id'>) => {
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, response.data.data]);
      return response.data.data;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => task._id === id ? response.data.data : task));
      return response.data.data;
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
}
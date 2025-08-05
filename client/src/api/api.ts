import axios from "axios";
import type { Task, ApiResponse, CreateTaskRequest, UpdateTaskRequest } from "../types/index.ts";

const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints
export const tasksApi = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>("/tasks");
    return response.data.data;
  },

  // Create a new task
  createTask: async (taskData: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>("/tasks", taskData);
    return response.data.data;
  },

  // Update a task
  updateTask: async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, updates);
    return response.data.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Get a specific task
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },
};

export default api;
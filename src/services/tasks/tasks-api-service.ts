import { typeCard } from "@/types/card-types";
import api from "./inteceptor";

class TasksApiService {
  async getAll(): Promise<typeCard[]> {
    const response = await api.get("/tasks");
    return response.data.items;
  }

  async getId(id: string): Promise<typeCard> {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  }

  async post(task: Partial<typeCard>): Promise<typeCard> {
    const response = await api.post(`/tasks`, task);
    return response.data; 
  }

  async put(task: typeCard): Promise<typeCard> {
    const response = await api.put(`/tasks/${task.id}`, task);
    return response.data;
  }

  async patch(task: typeCard): Promise<typeCard> {
    const response = await api.patch(`/tasks/${task.id}`, task);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
}

export default new TasksApiService();

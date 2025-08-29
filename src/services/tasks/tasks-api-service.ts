import api from "./inteceptor";

class TasksApiService {
    async getAll() {
        const response = await api.get("/tasks");
        return response.data.items;
    }

    async getId(id: string) {
        console.log("metodo recebeu o id:", id);
        const {data} = await api.get(`/tasks/${id}`);
        return data;
    }
    async post(tasks: any) {
        const response = await api.post(`/tasks/${tasks.id}`, tasks);
        console.log(response.data);
    }
    async put(tasks: any) {
        const response = await api.put(`/tasks/${tasks.id}`, tasks);
        console.log(response.data);
    }
    async patch(tasks: any) {
        const response = await api.patch(`/tasks/${tasks.id}`, tasks);
        console.log(response.data);
    }
    async delete(id: string) {
        const response = await api.delete(`/tasks/${id}`);
        console.log(response.data);
    }
}

export default new TasksApiService();
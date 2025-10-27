package com.sge.sge_app.services;

import com.sge.sge_app.models.Task;
import com.sge.sge_app.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Task getTaskById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Task createTask(Task task) {
        return repository.save(task);
    }

    public Task updateTask(Long id, Task taskDetails) {
        Task task = getTaskById(id);
        if (task != null) {
            task.setTitulo(taskDetails.getTitulo());
            task.setDescricao(taskDetails.getDescricao());
            task.setStatus(taskDetails.getStatus());
            task.setPrioridade(taskDetails.getPrioridade());
            task.setResponsavel(taskDetails.getResponsavel());
            task.setDataConclusao(taskDetails.getDataConclusao());
            return repository.save(task);
        }
        return null;
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
}
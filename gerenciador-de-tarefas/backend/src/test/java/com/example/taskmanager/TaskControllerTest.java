package com.example.taskmanager;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TaskService taskService;

    @Test
    void shouldReturnAllTasks() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Planejar testes");
        task.setDescription("Cobrir backend e frontend");
        task.setStatus(TaskStatus.IN_PROGRESS);
        task.setCreatedAt(LocalDateTime.of(2026, 4, 30, 10, 0));
        task.setUpdatedAt(LocalDateTime.of(2026, 4, 30, 11, 0));

        when(taskService.findAll()).thenReturn(List.of(task));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].title").value("Planejar testes"))
                .andExpect(jsonPath("$[0].status").value("IN_PROGRESS"));
    }

    @Test
    void shouldCreateTask() throws Exception {
        Task request = new Task();
        request.setTitle("Nova tarefa");
        request.setDescription("Descricao da tarefa");
        request.setStatus(TaskStatus.PENDING);

        Task created = new Task();
        created.setId(9L);
        created.setTitle(request.getTitle());
        created.setDescription(request.getDescription());
        created.setStatus(request.getStatus());
        created.setCreatedAt(LocalDateTime.of(2026, 4, 30, 12, 0));
        created.setUpdatedAt(LocalDateTime.of(2026, 4, 30, 12, 0));

        when(taskService.create(any(Task.class))).thenReturn(created);

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(9L))
                .andExpect(jsonPath("$.title").value("Nova tarefa"));
    }

    @Test
    void shouldDeleteTask() throws Exception {
        mockMvc.perform(delete("/api/tasks/3"))
                .andExpect(status().isNoContent());
    }
}
package com.example.taskmanager;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void createShouldSetDefaultStatusAndTimestamps() {
        Task newTask = new Task();
        newTask.setTitle("Planejar testes");
        newTask.setDescription("Cobrir backend e frontend");

        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task createdTask = taskService.create(newTask);

        assertThat(createdTask.getStatus()).isEqualTo(TaskStatus.PENDING);
        assertThat(createdTask.getCreatedAt()).isNotNull();
        assertThat(createdTask.getUpdatedAt()).isNotNull();
        assertThat(createdTask.getCreatedAt()).isEqualTo(createdTask.getUpdatedAt());
        verify(taskRepository).save(newTask);
    }

    @Test
    void updateShouldReplaceFieldsAndRefreshUpdatedAt() {
        Task existingTask = new Task();
        existingTask.setId(1L);
        existingTask.setTitle("Titulo antigo");
        existingTask.setDescription("Descricao antiga");
        existingTask.setStatus(TaskStatus.PENDING);
        existingTask.setCreatedAt(LocalDateTime.of(2026, 4, 30, 10, 0));
        existingTask.setUpdatedAt(LocalDateTime.of(2026, 4, 30, 10, 0));

        Task updatedData = new Task();
        updatedData.setTitle("Titulo novo");
        updatedData.setDescription("Descricao nova");
        updatedData.setStatus(TaskStatus.DONE);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(existingTask));
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Task updatedTask = taskService.update(1L, updatedData);

        assertThat(updatedTask.getId()).isEqualTo(1L);
        assertThat(updatedTask.getTitle()).isEqualTo("Titulo novo");
        assertThat(updatedTask.getDescription()).isEqualTo("Descricao nova");
        assertThat(updatedTask.getStatus()).isEqualTo(TaskStatus.DONE);
        assertThat(updatedTask.getCreatedAt()).isEqualTo(existingTask.getCreatedAt());
        assertThat(updatedTask.getUpdatedAt()).isNotNull();
        verify(taskRepository).save(existingTask);
    }

    @Test
    void findByIdShouldThrowWhenTaskDoesNotExist() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.findById(99L))
                .isInstanceOf(TaskNotFoundException.class)
                .hasMessage("Task not found: 99");
    }

    @Test
    void deleteShouldRemoveExistingTask() {
        Task existingTask = new Task();
        existingTask.setId(7L);
        existingTask.setTitle("Remover teste");
        existingTask.setDescription("Teste de exclusao");
        existingTask.setStatus(TaskStatus.PENDING);

        when(taskRepository.findById(7L)).thenReturn(Optional.of(existingTask));

        taskService.delete(7L);

        verify(taskRepository).delete(existingTask);
    }
}
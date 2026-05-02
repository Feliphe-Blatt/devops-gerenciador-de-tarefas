import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import TaskManagerPage, { deleteTask, editTask, loadTasks, resetTaskForm, saveTask } from './task-manager-page';
import { initialForm, type Task } from './task-ui';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as typeof fetch;
  globalThis.confirm = vi.fn(() => true) as typeof confirm;
});

function createSetterSpy<T>() {
  const calls: T[] = [];
  const setter = (value: T) => {
    calls.push(value);
  };

  return { calls, setter };
}

describe('TaskManagerPage', () => {
  it('renders the static shell', () => {
    const html = renderToStaticMarkup(<TaskManagerPage />);

    expect(html).toContain('Taskflow Studio');
    expect(html).toContain('Lista de tarefas');
  });

  it('loads tasks and updates the loading state', async () => {
    const tasks: Task[] = [
      {
        id: 1,
        title: 'Primeira tarefa',
        description: 'Detalhe inicial',
        status: 'DONE',
        createdAt: '2026-04-30T10:00:00.000',
        updatedAt: '2026-04-30T11:00:00.000'
      }
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => tasks
    } as Response);

    const setTasks = createSetterSpy<Task[]>();
    const setLoading = createSetterSpy<boolean>();
    const setError = createSetterSpy<string>();

    await loadTasks({ apiUrl: 'http://localhost:8080', fetchImpl: fetchMock as typeof fetch }, {
      setTasks: setTasks.setter,
      setLoading: setLoading.setter,
      setError: setError.setter
    });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/tasks', { cache: 'no-store' });
    expect(setTasks.calls).toEqual([tasks]);
    expect(setLoading.calls).toEqual([true, false]);
    expect(setError.calls).toEqual(['']);
  });

  it('creates and updates tasks through the helpers', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 2 })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1 })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);

    const setTasks = createSetterSpy<Task[]>();
    const setForm = createSetterSpy<typeof initialForm>();
    const setEditingId = createSetterSpy<number | null>();
    const setLoading = createSetterSpy<boolean>();
    const setSaving = createSetterSpy<boolean>();
    const setMessage = createSetterSpy<string>();
    const setError = createSetterSpy<string>();

    await saveTask(
      { preventDefault() {} } as never,
      { apiUrl: 'http://localhost:8080', fetchImpl: fetchMock as typeof fetch },
      {
        form: {
          title: 'Nova tarefa QA',
          description: 'Cobrir o fluxo principal',
          status: 'IN_PROGRESS'
        },
        editingId: null
      },
      {
        setTasks: setTasks.setter,
        setForm: setForm.setter,
        setEditingId: setEditingId.setter,
        setLoading: setLoading.setter,
        setSaving: setSaving.setter,
        setMessage: setMessage.setter,
        setError: setError.setter
      }
    );

    await saveTask(
      { preventDefault() {} } as never,
      { apiUrl: 'http://localhost:8080', fetchImpl: fetchMock as typeof fetch },
      {
        form: {
          title: 'Atualizar',
          description: '',
          status: 'DONE'
        },
        editingId: 7
      },
      {
        setTasks: setTasks.setter,
        setForm: setForm.setter,
        setEditingId: setEditingId.setter,
        setLoading: setLoading.setter,
        setSaving: setSaving.setter,
        setMessage: setMessage.setter,
        setError: setError.setter
      }
    );

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'http://localhost:8080/api/tasks', expect.objectContaining({
      method: 'POST'
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, 'http://localhost:8080/api/tasks/7', expect.objectContaining({
      method: 'PUT'
    }));
    expect(setMessage.calls).toContain('Tarefa criada com sucesso.');
    expect(setMessage.calls).toContain('Tarefa atualizada com sucesso.');
    expect(setEditingId.calls).toContain(null);
    expect(setForm.calls).toContain(initialForm);
    expect(setSaving.calls).toEqual([true, false, true, false]);
  });

  it('deletes and resets the editing state when needed', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => []
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);

    const setTasks = createSetterSpy<Task[]>();
    const setForm = createSetterSpy<typeof initialForm>();
    const setEditingId = createSetterSpy<number | null>();
    const setLoading = createSetterSpy<boolean>();
    const setSaving = createSetterSpy<boolean>();
    const setMessage = createSetterSpy<string>();
    const setError = createSetterSpy<string>();

    await deleteTask(
      7,
      { apiUrl: 'http://localhost:8080', fetchImpl: fetchMock as typeof fetch, confirmImpl: () => true },
      { editingId: 7 },
      {
        setTasks: setTasks.setter,
        setForm: setForm.setter,
        setEditingId: setEditingId.setter,
        setLoading: setLoading.setter,
        setSaving: setSaving.setter,
        setMessage: setMessage.setter,
        setError: setError.setter
      }
    );

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/tasks/7', { method: 'DELETE' });
    expect(setForm.calls).toContain(initialForm);
    expect(setEditingId.calls).toContain(null);
    expect(setMessage.calls).toContain('Tarefa excluída com sucesso.');
  });

  it('updates local editing state helpers', () => {
    const setEditingId = createSetterSpy<number | null>();
    const setForm = createSetterSpy<typeof initialForm>();
    const setMessage = createSetterSpy<string>();
    const setError = createSetterSpy<string>();

    editTask(
      {
        id: 9,
        title: 'Editar item',
        description: 'Detalhe',
        status: 'IN_PROGRESS',
        createdAt: null,
        updatedAt: null
      },
      {
        setEditingId: setEditingId.setter,
        setForm: setForm.setter,
        setMessage: setMessage.setter
      }
    );

    resetTaskForm({
      setForm: setForm.setter,
      setEditingId: setEditingId.setter,
      setMessage: setMessage.setter,
      setError: setError.setter
    });

    expect(setEditingId.calls).toEqual([9, null]);
    expect(setMessage.calls).toContain('Editando tarefa #9.');
    expect(setMessage.calls).toContain('');
    expect(setError.calls).toEqual(['']);
  });

  it('handles loading and saving errors', async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: false,
        json: async () => []
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => []
      } as Response);

    const setTasks = createSetterSpy<Task[]>();
    const setForm = createSetterSpy<typeof initialForm>();
    const setEditingId = createSetterSpy<number | null>();
    const setLoading = createSetterSpy<boolean>();
    const setSaving = createSetterSpy<boolean>();
    const setMessage = createSetterSpy<string>();
    const setError = createSetterSpy<string>();

    await loadTasks({ apiUrl: 'http://localhost:8080', fetchImpl: fetchMock as typeof fetch }, {
      setTasks: setTasks.setter,
      setLoading: setLoading.setter,
      setError: setError.setter
    });

    await saveTask(
      { preventDefault() {} } as never,
      { apiUrl: 'http://localhost:8080', fetchImpl: fetchMock as typeof fetch },
      {
        form: {
          title: 'Falha',
          description: '',
          status: 'PENDING'
        },
        editingId: null
      },
      {
        setTasks: setTasks.setter,
        setForm: setForm.setter,
        setEditingId: setEditingId.setter,
        setLoading: setLoading.setter,
        setSaving: setSaving.setter,
        setMessage: setMessage.setter,
        setError: setError.setter
      }
    );

    expect(setError.calls).toContain('Não foi possível carregar as tarefas.');
    expect(setError.calls).toContain('Não foi possível salvar a tarefa.');
    expect(setSaving.calls).toEqual([true, false]);
  });

  it('skips deletion when confirmation is declined', async () => {
    const setTasks = createSetterSpy<Task[]>();
    const setForm = createSetterSpy<typeof initialForm>();
    const setEditingId = createSetterSpy<number | null>();
    const setLoading = createSetterSpy<boolean>();
    const setSaving = createSetterSpy<boolean>();
    const setMessage = createSetterSpy<string>();
    const setError = createSetterSpy<string>();

    await deleteTask(
      7,
      { apiUrl: 'http://localhost:8080', fetchImpl: fetchMock as typeof fetch, confirmImpl: () => false },
      { editingId: 7 },
      {
        setTasks: setTasks.setter,
        setForm: setForm.setter,
        setEditingId: setEditingId.setter,
        setLoading: setLoading.setter,
        setSaving: setSaving.setter,
        setMessage: setMessage.setter,
        setError: setError.setter
      }
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(setMessage.calls).toEqual([]);
    expect(setError.calls).toEqual([]);
  });
});
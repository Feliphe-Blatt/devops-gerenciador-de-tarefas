"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  getSubmitLabel,
  initialForm,
  statusClassName,
  statusLabels,
  type Task,
  type TaskForm,
  type TaskStatus
} from "./task-ui";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

type TaskManagerSetters = {
  setTasks: (tasks: Task[]) => void;
  setForm: React.Dispatch<React.SetStateAction<TaskForm>>;
  setEditingId: (value: number | null) => void;
  setLoading: (value: boolean) => void;
  setSaving: (value: boolean) => void;
  setMessage: (value: string) => void;
  setError: (value: string) => void;
};

type TaskManagerDeps = {
  apiUrl: string;
  fetchImpl?: typeof fetch;
  confirmImpl?: (message: string) => boolean;
};

type TaskManagerCurrentState = {
  form: TaskForm;
  editingId: number | null;
};

function getFetchImpl(fetchImpl?: typeof fetch) {
  return fetchImpl ?? globalThis.fetch.bind(globalThis);
}

function getConfirmImpl(confirmImpl?: (message: string) => boolean) {
  return confirmImpl ?? globalThis.confirm.bind(globalThis);
}

export async function loadTasks(
  deps: TaskManagerDeps,
  setters: Pick<TaskManagerSetters, "setTasks" | "setLoading" | "setError">
) {
  const fetchImpl = getFetchImpl(deps.fetchImpl);

  setters.setLoading(true);
  setters.setError("");

  try {
    const response = await fetchImpl(`${deps.apiUrl}/api/tasks`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Não foi possível carregar as tarefas.");
    }

    const data: Task[] = await response.json();
    setters.setTasks(data);
  } catch (loadError) {
    setters.setError(loadError instanceof Error ? loadError.message : "Erro inesperado ao carregar tarefas.");
  } finally {
    setters.setLoading(false);
  }
}

export async function saveTask(
  event: FormEvent<HTMLFormElement>,
  deps: TaskManagerDeps,
  current: TaskManagerCurrentState,
  setters: TaskManagerSetters
) {
  event.preventDefault();
  const fetchImpl = getFetchImpl(deps.fetchImpl);
  const isEditing = current.editingId !== null;
  const payload = {
    title: current.form.title.trim(),
    description: current.form.description.trim(),
    status: current.form.status
  };

  setters.setSaving(true);
  setters.setError("");
  setters.setMessage("");

  try {
    const response = await fetchImpl(
      isEditing ? `${deps.apiUrl}/api/tasks/${current.editingId}` : `${deps.apiUrl}/api/tasks`,
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error("Não foi possível salvar a tarefa.");
    }

    setters.setForm(initialForm);
    setters.setEditingId(null);
    setters.setMessage(isEditing ? "Tarefa atualizada com sucesso." : "Tarefa criada com sucesso.");
    await loadTasks(deps, setters);
  } catch (saveError) {
    setters.setError(saveError instanceof Error ? saveError.message : "Erro inesperado ao salvar tarefa.");
  } finally {
    setters.setSaving(false);
  }
}

export async function deleteTask(
  id: number,
  deps: TaskManagerDeps,
  current: Pick<TaskManagerCurrentState, "editingId">,
  setters: Pick<TaskManagerSetters, "setForm" | "setEditingId" | "setMessage" | "setError" | "setTasks" | "setLoading">
) {
  const confirmImpl = getConfirmImpl(deps.confirmImpl);

  if (!confirmImpl("Deseja excluir esta tarefa?")) {
    return;
  }

  const fetchImpl = getFetchImpl(deps.fetchImpl);
  setters.setError("");
  setters.setMessage("");

  try {
    const response = await fetchImpl(`${deps.apiUrl}/api/tasks/${id}`, {
      method: "DELETE"
    });

    if (!response.ok && response.status !== 204) {
      throw new Error("Não foi possível excluir a tarefa.");
    }

    if (current.editingId === id) {
      setters.setForm(initialForm);
      setters.setEditingId(null);
    }

    setters.setMessage("Tarefa excluída com sucesso.");
    await loadTasks(deps, setters);
  } catch (deleteError) {
    setters.setError(deleteError instanceof Error ? deleteError.message : "Erro inesperado ao excluir tarefa.");
  }
}

export function editTask(task: Task, setters: Pick<TaskManagerSetters, "setEditingId" | "setForm" | "setMessage">) {
  setters.setEditingId(task.id);
  setters.setForm({
    title: task.title,
    description: task.description ?? "",
    status: task.status
  });
  setters.setMessage(`Editando tarefa #${task.id}.`);
}

export function resetTaskForm(setters: Pick<TaskManagerSetters, "setForm" | "setEditingId" | "setMessage" | "setError">) {
  setters.setForm(initialForm);
  setters.setEditingId(null);
  setters.setMessage("");
  setters.setError("");
}

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadTasks(
      { apiUrl },
      {
        setTasks,
        setLoading,
        setError
      }
    );
  }, []);

  const currentState = { form, editingId };
  const setters: TaskManagerSetters = {
    setTasks,
    setForm,
    setEditingId,
    setLoading,
    setSaving,
    setMessage,
    setError
  };

  let taskContent;

  if (loading) {
    taskContent = <div className="empty-state">Carregando tarefas...</div>;
  } else if (tasks.length === 0) {
    taskContent = (
      <div className="empty-state">Nenhuma tarefa cadastrada ainda. Crie a primeira tarefa no formulário ao lado.</div>
    );
  } else {
    taskContent = (
      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-item" key={task.id}>
            <div className="task-item__top">
              <div>
                <h3 className="task-item__title">{task.title}</h3>
                <p className="task-item__description">{task.description || "Sem descrição registrada."}</p>
              </div>
              <span className={statusClassName[task.status]}>{statusLabels[task.status]}</span>
            </div>

            <div className="task-item__meta">
              {task.createdAt ? <span className="badge">Criada em {new Date(task.createdAt).toLocaleString("pt-BR")}</span> : null}
              {task.updatedAt ? <span className="badge">Atualizada em {new Date(task.updatedAt).toLocaleString("pt-BR")}</span> : null}
            </div>

            <div className="task-item__controls">
              <button className="button button--ghost" type="button" onClick={() => editTask(task, setters)}>
                Editar
              </button>
              <button className="button button--danger" type="button" onClick={() => void deleteTask(task.id, { apiUrl }, { editingId }, setters)}>
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <article className="hero__panel">
          <span className="eyebrow">Projeto final DevOps</span>
          <h1>Taskflow Studio</h1>
          <p>
            Uma base simples para gerenciar tarefas do dia a dia com criação, edição, mudança de status e exclusão, conectada ao backend em Spring Boot.
          </p>
        </article>

        <aside className="hero__aside">
          <div className="stat">
            <div className="stat__label">Tarefas carregadas</div>
            <div className="stat__value">{tasks.length}</div>
            <div className="stat__note">A listagem é obtida diretamente da API em <strong>{apiUrl}</strong>.</div>
          </div>

          <div className="stat">
            <div className="stat__label">Fluxo Git</div>
            <div className="stat__value">main / develop / feature</div>
            <div className="stat__note">Cada alteração relevante nasce em uma branch de feature e entra em develop por merge dedicado.</div>
          </div>
        </aside>
      </section>

      <section className="workspace">
        <article className="card">
          <h2>{editingId === null ? "Nova tarefa" : `Editar tarefa #${editingId}`}</h2>
          <p className="card__subtitle">Crie uma tarefa simples ou carregue um item da lista para editar e salvar novamente.</p>

          <form className="form" onSubmit={(event) => void saveTask(event, { apiUrl }, currentState, setters)}>
            <div className="field">
              <label htmlFor="title">Título</label>
              <input
                id="title"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Ex.: Revisar containerização"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Detalhe aqui a próxima ação da tarefa"
              />
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TaskStatus }))}
              >
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="DONE">Concluída</option>
              </select>
            </div>

            <div className="form__actions">
              <button className="button button--primary" type="submit" disabled={saving}>
                {saving ? "Salvando..." : getSubmitLabel(editingId)}
              </button>
              <button className="button button--ghost" type="button" onClick={() => resetTaskForm(setters)}>
                Limpar formulário
              </button>
            </div>

            {error ? <p className="feedback feedback--error">{error}</p> : null}
            {message ? <p className="feedback feedback--success">{message}</p> : null}
          </form>
        </article>

        <article className="card">
          <h2>Lista de tarefas</h2>
          <p className="card__subtitle">A API retorna os dados e a interface permite criar, editar e excluir sem sair da página.</p>

          {taskContent}
        </article>
      </section>
    </main>
  );
}

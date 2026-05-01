"use client";

import { FormEvent, useEffect, useState } from "react";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
};

type TaskForm = {
  title: string;
  description: string;
  status: TaskStatus;
};

const initialForm: TaskForm = {
  title: "",
  description: "",
  status: "PENDING"
};

const statusLabels: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluída"
};

const statusClassName: Record<TaskStatus, string> = {
  PENDING: "badge badge--pending",
  IN_PROGRESS: "badge badge--progress",
  DONE: "badge badge--done"
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/api/tasks`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar as tarefas.");
      }

      const data: Task[] = await response.json();
      setTasks(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Erro inesperado ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status
    };

    try {
      const response = await fetch(
        editingId === null ? `${apiUrl}/api/tasks` : `${apiUrl}/api/tasks/${editingId}`,
        {
          method: editingId === null ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possível salvar a tarefa.");
      }

      setForm(initialForm);
      setEditingId(null);
      setMessage(editingId === null ? "Tarefa criada com sucesso." : "Tarefa atualizada com sucesso.");
      await loadTasks();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Erro inesperado ao salvar tarefa.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const shouldDelete = globalThis.confirm("Deseja excluir esta tarefa?");

    if (!shouldDelete) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("Não foi possível excluir a tarefa.");
      }

      if (editingId === id) {
        setForm(initialForm);
        setEditingId(null);
      }

      setMessage("Tarefa excluída com sucesso.");
      await loadTasks();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Erro inesperado ao excluir tarefa.");
    }
  }

  function handleEdit(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description ?? "",
      status: task.status
    });
    setMessage(`Editando tarefa #${task.id}.`);
  }

  function handleReset() {
    setForm(initialForm);
    setEditingId(null);
    setMessage("");
    setError("");
  }

  const submitLabel = editingId === null ? "Criar tarefa" : "Atualizar tarefa";

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
              <button className="button button--ghost" type="button" onClick={() => handleEdit(task)}>
                Editar
              </button>
              <button className="button button--danger" type="button" onClick={() => void handleDelete(task.id)}>
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

          <form className="form" onSubmit={handleSubmit}>
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
                {saving ? "Salvando..." : submitLabel}
              </button>
              <button className="button button--ghost" type="button" onClick={handleReset}>
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

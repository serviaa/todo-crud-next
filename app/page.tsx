"use client";
import { useEffect, useState } from "react";

type Activity = { id?: number; time: string; activity: string; done?: boolean };
type Todo = {
  id: number;
  title: string;
  deskripsi: string | null;
  created_at: string;
  activities: Activity[];
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [activities, setActivities] = useState<Activity[]>([
    { time: "", activity: "" },
  ]);

  // modal edit
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  async function refresh() {
  const res = await fetch("/api/todos");
  const data: RawTodo[] = await res.json();
  const normalized: Todo[] = data.map((t) => ({
    ...t,
    activities: Array.isArray(t.activities)
      ? t.activities
      : JSON.parse(t.activities || "[]"),
  }));
  setTodos(normalized);
}


  useEffect(() => {
    refresh();
  }, []);

  // CREATE
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, deskripsi, activities }),
    });
    setTitle("");
    setDeskripsi("");
    setActivities([{ time: "", activity: "" }]);
    refresh();
  }

  // SAVE edit todo
  async function saveTodo(todo: Todo) {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "todo",
        id: todo.id,
        title: todo.title,
        deskripsi: todo.deskripsi,
      }),
    });
    setEditingTodo(null);
    refresh();
  }

  // SAVE edit activity
  async function saveActivity(activity: Activity) {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "activity",
        id: activity.id,
        time: activity.time,
        activity: activity.activity,
        done: activity.done,
      }),
    });
    setEditingActivity(null);
    refresh();
  }

  // DELETE
  async function removeTodo(id: number) {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "todo", id }),
    });
    refresh();
  }
  async function removeActivity(id: number) {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "activity", id }),
    });
    refresh();
  }

  const addActivity = () => {
    setActivities([...activities, { time: "", activity: "" }]);
  };

  const handleChange = (i: number, field: "time" | "activity", value: string) => {
    const updated = [...activities];
    updated[i][field] = value;
    setActivities(updated);
  };

  return (
    <div className="todo-container">
      <h1 className="page-title">Manage Your Todos</h1>

      {/* CREATE */}
      <form onSubmit={handleSubmit} className="form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul Todo"
          required
        />
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Deskripsi (opsional)"
        />

        {activities.map((act, i) => (
          <div key={i} className="activity-input">
            <input
              value={act.time}
              onChange={(e) => handleChange(i, "time", e.target.value)}
              placeholder="Waktu"
            />
            <input
              value={act.activity}
              onChange={(e) => handleChange(i, "activity", e.target.value)}
              placeholder="Aktivitas"
              required
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={addActivity} className="btn-outline">
            + Tambah kegiatan
          </button>
          <button type="submit" className="btn-primary">
            Simpan
          </button>
        </div>
      </form>

      {/* LIST */}
      <ul className="todo-list">
        {todos.map((t) => (
          <li key={t.id} className="todo-card">
            <div className="todo-header">
              <span className="todo-title">{t.title}</span>
              <div className="todo-actions">
                <button
                  type="button"
                  onClick={() => setEditingTodo(t)}
                  className="btn-edit"
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={() => removeTodo(t.id)}
                  className="btn-delete"
                >
                  ✕
                </button>
              </div>
            </div>

            {t.deskripsi && <p className="todo-desc">{t.deskripsi}</p>}

            {t.activities.length > 0 && (
              <ul className="activity-list">
                {t.activities.map((a) => (
                  <li key={a.id} className="activity-item">
                    <input
                      type="checkbox"
                      checked={a.done || false}
                      onChange={() =>
                        saveActivity({ ...a, done: !(a.done ?? false) })
                      }
                    />
                    <span
                      className={`activity-text ${
                        a.done ? "activity-done" : ""
                      }`}
                    >
                      <strong>{a.time}</strong> {a.activity}
                    </span>
                    <div className="activity-actions">
                      <button
                        type="button"
                        onClick={() => setEditingActivity(a)}
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        onClick={() => removeActivity(a.id!)}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* MODAL EDIT TODO */}
      {editingTodo && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Todo</h2>
            <input
              value={editingTodo.title}
              onChange={(e) =>
                setEditingTodo({ ...editingTodo, title: e.target.value })
              }
              placeholder="Judul Todo"
            />
            <textarea
              value={editingTodo.deskripsi ?? ""}
              onChange={(e) =>
                setEditingTodo({ ...editingTodo, deskripsi: e.target.value })
              }
              placeholder="Deskripsi"
            />
            <div className="edit-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveTodo(editingTodo)}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setEditingTodo(null)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT ACTIVITY */}
      {editingActivity && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Activity</h2>
            <input
              value={editingActivity.time}
              onChange={(e) =>
                setEditingActivity({ ...editingActivity, time: e.target.value })
              }
              placeholder="Waktu"
            />
            <input
              value={editingActivity.activity}
              onChange={(e) =>
                setEditingActivity({
                  ...editingActivity,
                  activity: e.target.value,
                })
              }
              placeholder="Aktivitas"
            />
            <div className="edit-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => saveActivity(editingActivity)}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setEditingActivity(null)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

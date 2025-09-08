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

  async function refresh() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    refresh();
  }, []);

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

  async function toggleActivity(id: number, done: boolean) {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done: !done }),
    });
    refresh();
  }

  async function removeTodo(id: number) {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  const addActivity = () => {
    setActivities([...activities, { time: "", activity: "" }]);
  };

  const handleChange = (i: number, field: keyof Activity, value: string) => {
    const updated = [...activities];
    updated[i][field] = value;
    setActivities(updated);
  };

  return (
    <div className="todo-container">
      <h1 className="page-title">Manage Your Todos</h1>

      {/* Form */}
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

        <button type="button" onClick={addActivity} className="btn-outline">
          + Tambah kegiatan
        </button>
        <button type="submit" className="btn-primary">
          Simpan
        </button>
      </form>

      {/* Daftar todos */}
      <ul className="todo-list">
        {todos.map((t) => (
          <li key={t.id} className="todo-card">
            <div className="todo-header">
              <span className="todo-title">{t.title}</span>
              <button onClick={() => removeTodo(t.id)} className="btn-delete">
                ✕
              </button>
            </div>
            {t.deskripsi && <p className="todo-desc">{t.deskripsi}</p>}
            {t.activities.length > 0 && (
              <ul className="activity-list">
                {t.activities.map((a) => (
                  <li key={a.id} className="activity-item">
                    <input
                      type="checkbox"
                      checked={a.done || false}
                      onChange={() => toggleActivity(a.id!, a.done || false)}
                    />
                    <span
                      className={`activity-text ${
                        a.done ? "activity-done" : ""
                      }`}
                    >
                      <strong>{a.time}</strong> {a.activity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";

interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  dueDate?: string;
  subject?: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subject, setSubject] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editSubject, setEditSubject] = useState("");

  async function refresh() {
    const res = await fetch("/api/todos");
    setTodos(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, dueDate, subject }),
    });
    setTitle("");
    setDueDate("");
    setSubject("");
    refresh();
  }

  async function toggle(id: string, done: boolean) {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id, done: !done }),
    });
    refresh();
  }

  function startEdit(todo: Todo) {
    setEditId(todo.id);
    setEditTitle(todo.title);
    setEditDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
    setEditSubject(todo.subject || "");
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({
        id: editId,
        title: editTitle,
        dueDate: editDueDate,
        subject: editSubject,
      }),
    });
    setEditId(null);
    setEditTitle("");
    setEditDueDate("");
    setEditSubject("");
    refresh();
  }

  async function remove(id: string) {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    refresh();
  }

  return (
    <div
      style={{
        fontFamily: "system-ui",
        background: "#f9f9f9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          background: "#000",
          padding: "16px 32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>TODO CRUD Next.js</h1>
        <nav style={{ display: "flex", gap: "16px" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </a>
          <a href="/about" style={{ color: "white", textDecoration: "none" }}>
            About
          </a>
        </nav>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          maxWidth: 700,
          margin: "40px auto",
          padding: "16px",
          borderRadius: "12px",
          background: "white",
          border: "1px solid #ddd",
          width: "100%",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Daftar Tugas</h2>

        {/* Form tambah todo */}
        <form onSubmit={addTodo} style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Judul tugas..."
            required
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Pilih Mapel</option>
            <option value="PaaS">PaaS (Platform as a Service)</option>
            <option value="SaaS">SaaS (Software as a Service)</option>
            <option value="IaaS">IaaS (Infrastructure as a Service)</option>
            <option value="IoT">IoT (Internet of Things)</option>
            <option value="PKK">PKK (Produk Kreatif & Kewirausahaan)</option>
            <option value="MPP">MPP (Mata Pelajaran Pilihan)</option>
          </select>
          <button
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "none",
              background: "#000",
              color: "white",
              cursor: "pointer",
            }}
          >
            Tambah
          </button>
        </form>

        {/* Daftar todo */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.length === 0 && (
            <p style={{ textAlign: "center", color: "#888" }}>Belum ada todo 🙌</p>
          )}
          {todos.map((t) => (
            <li
              key={t.id}
              style={{
                marginBottom: "12px",
                padding: "12px",
                border: "1px solid #eee",
                borderRadius: "8px",
                background: "#fafafa",
              }}
            >
              {editId === t.id ? (
                <form onSubmit={saveEdit} style={{ display: "grid", gap: "8px" }}>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                  <select
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  >
                    <option value="">Pilih Mapel</option>
                    <option value="PaaS">PaaS (Platform as a Service)</option>
                    <option value="SaaS">SaaS (Software as a Service)</option>
                    <option value="IaaS">IaaS (Infrastructure as a Service)</option>
                    <option value="IoT">IoT (Internet of Things)</option>
                    <option value="PKK">PKK (Produk Kreatif & Kewirausahaan)</option>
                    <option value="MPP">MPP (Mata Pelajaran Pilihan)</option>
                  </select>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={{
                        flex: 1,
                        background: "black",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      ✔ Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      style={{
                        flex: 1,
                        background: "gray",
                        border: "none",
                        padding: "8px",
                        borderRadius: "6px",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      ✖ Batal
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggle(t.id, t.done)}
                      />
                      <span
                        style={{
                          textDecoration: t.done ? "line-through" : "none",
                          color: t.done ? "#888" : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {t.title}
                      </span>
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => startEdit(t)}
                        style={{
                          background: "black",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => remove(t.id)}
                        style={{
                          background: "gray",
                          border: "none",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        🗑 Hapus
                      </button>
                    </div>
                  </div>
                  <p style={{ marginLeft: "24px", marginTop: "4px", fontSize: "14px" }}>
                    📅 {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "Tanpa tenggat"} | 📚{" "}
                    {t.subject === "PaaS"
                      ? "PaaS (Platform as a Service)"
                      : t.subject === "SaaS"
                      ? "SaaS (Software as a Service)"
                      : t.subject === "IaaS"
                      ? "IaaS (Infrastructure as a Service)"
                      : t.subject === "IoT"
                      ? "IoT (Internet of Things)"
                      : t.subject === "PKK"
                      ? "PKK (Produk Kreatif & Kewirausahaan)"
                      : t.subject === "MPP"
                      ? "MPP (Mata Pelajaran Pilihan)"
                      : "Tanpa mapel"}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "auto",
          padding: "16px",
          textAlign: "center",
          background: "#111",
          color: "white",
        }}
      >
        <p>© 2025 TODO CRUD Next.js</p>
      </footer>
    </div>
  );
}

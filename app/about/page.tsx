export default function About() {
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
          padding: "32px",
          borderRadius: "12px",
          background: "white",
          border: "1px solid #ddd",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Tentang Website</h2>
        <p style={{ color: "#555", lineHeight: "1.6", fontSize: "16px" }}>
          Website ini dibuat untuk <b>mencatat daftar tugas</b> dengan mudah.
          Kamu bisa menambahkan, mengedit, menandai selesai, atau menghapus
          tugas sesuai kebutuhan.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "24px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>✨ Fitur Utama</h3>
            <ul style={{ lineHeight: "1.6", paddingLeft: "16px" }}>
              <li>Create → tambah tugas</li>
              <li>Read → lihat daftar</li>
              <li>Update → edit atau tandai selesai</li>
              <li>Delete → hapus tugas</li>
            </ul>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>🎯 Tujuan</h3>
            <p style={{ lineHeight: "1.6", color: "#555" }}>
              Membantu mengatur tugas harian secara sederhana, praktis, dan
              efisien. Bisa ditambah dengan tenggat waktu & kategori mapel.
            </p>
          </div>
        </div>
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

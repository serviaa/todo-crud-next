import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Todo Project",
  description: "A minimalist todo app with Neon Postgres",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <nav>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="main">{children}</main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Todo Project · Built with love</p>
        </footer>
      </body>
    </html>
  );
}

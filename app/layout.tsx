import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "TaskMate",
  description: "Kelola tugasmu dengan mudah",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="logo">TaskMate</div>
          <nav className="navbar">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} TaskMate. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

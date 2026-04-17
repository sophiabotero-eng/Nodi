import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "ArchNodi",
  description: "Learn CAD. Design out loud.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="bg-black text-white mt-20 py-8 text-center text-sm">
          © {new Date().getFullYear()} ArchNodi
        </footer>
      </body>
    </html>
  );
}

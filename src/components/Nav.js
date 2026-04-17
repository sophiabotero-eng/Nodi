import Link from "next/link";

export default function Nav() {
  return (
    <header className="bg-[#FFF8F0] border-b-2 border-black">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          <span className="text-pink-500">Arch</span>Nodi
          <span className="text-yellow-400">.</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/blog">Blog</Link>
          <Link href="/tutorials">Tutorials</Link>
          <Link href="/community">Community</Link>
          <Link href="/profile" className="px-3 py-1 rounded-full bg-black text-white">
            Account
          </Link>
        </nav>
      </div>
    </header>
  );
}

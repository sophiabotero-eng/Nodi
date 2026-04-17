import Link from "next/link";

// Static homepage. No DB call at build time so nothing can fail here.
export default function Home() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16 text-center">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight">
        Learn CAD.<br />
        <span className="text-pink-500">Design</span>{" "}
        <span className="text-blue-500">out</span>{" "}
        <span className="text-green-500">loud</span>.
      </h1>
      <p className="mt-6 text-lg max-w-xl mx-auto">
        A playful home for architecture students and young designers.
        Tutorials, a blog, and a community that actually builds.
      </p>
      <div className="mt-8 flex gap-3 justify-center flex-wrap">
        <Link
          href="/signup"
          className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold"
        >
          Join free
        </Link>
        <Link
          href="/tutorials"
          className="px-6 py-3 rounded-full bg-yellow-400 font-semibold"
        >
          Browse tutorials
        </Link>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-6 text-left">
        <div className="rounded-2xl border-2 border-black p-6 bg-white">
          <h3 className="text-xl font-bold text-pink-500">Tutorials</h3>
          <p className="mt-2 text-sm">Rhino, Revit, Grasshopper. Short and focused.</p>
        </div>
        <div className="rounded-2xl border-2 border-black p-6 bg-white">
          <h3 className="text-xl font-bold text-blue-500">Blog</h3>
          <p className="mt-2 text-sm">Essays on tools, school, and studio life.</p>
        </div>
        <div className="rounded-2xl border-2 border-black p-6 bg-white">
          <h3 className="text-xl font-bold text-green-500">Community</h3>
          <p className="mt-2 text-sm">Share updates, find collaborators.</p>
        </div>
      </div>
    </section>
  );
}

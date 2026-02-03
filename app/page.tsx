import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-6xl px-8 py-16">
        <header className="text-center">
          <h1 className="text-5xl font-bold text-gray-900">BioCompute Job Portal</h1>
          <p className="mt-4 text-xl text-gray-600">Find your next career opportunity</p>
        </header>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Link
            href="/jobs"
            className="group rounded-lg bg-white p-8 shadow-lg transition hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">
              Browse Jobs →
            </h2>
            <p className="mt-2 text-gray-600">
              Explore available positions and apply for your dream job
            </p>
          </Link>

          <Link
            href="/admin/login"
            className="group rounded-lg bg-white p-8 shadow-lg transition hover:shadow-xl"
          >
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">
              Admin Portal →
            </h2>
            <p className="mt-2 text-gray-600">
              Manage job postings and review applications
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

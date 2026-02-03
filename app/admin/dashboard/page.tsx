import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Ensure this is a server component to fetch data securely

export default async function Dashboard() {
    // Fetch counts from the DB
    const jobsCount = await prisma.job.count();
    const applicationsCount = await prisma.application.count();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <div className="text-sm text-gray-500">Welcome, Admin</div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Stat Card 1 */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-500">Total Jobs</h2>
                    <p className="mt-2 text-4xl font-bold text-blue-600">{jobsCount}</p>
                </div>

                {/* Stat Card 2 */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-gray-500">Applications Received</h2>
                    <p className="mt-2 text-4xl font-bold text-green-600">{applicationsCount}</p>
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-xl font-semibold">Quick Actions</h3>
                <div className="flex gap-4">
                    <Link href="/admin/jobs" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Manage Jobs
                    </Link>
                    <Link href="/admin/applications" className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                        View All Applications
                    </Link>
                </div>
            </div>
        </div>
    );
}
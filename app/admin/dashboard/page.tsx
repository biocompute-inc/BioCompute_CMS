"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Ensure this is a server component to fetch data securely

export default function Dashboard() {
    const router = useRouter();
    const [jobsCount, setJobsCount] = useState(0);
    const [applicationsCount, setApplicationsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [jobsRes, appsRes] = await Promise.all([
                fetch("/api/admin/jobs"),
                fetch("/api/admin/applications")
            ]);

            if (jobsRes.ok && appsRes.ok) {
                const jobs = await jobsRes.json();
                const apps = await appsRes.json();
                setJobsCount(jobs.length);
                setApplicationsCount(apps.length);
            } else if (jobsRes.status === 401 || appsRes.status === 401) {
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            const res = await fetch("/api/admin/logout", { method: "POST" });
            if (res.ok) {
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Failed to logout", error);
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-black">Welcome, Admin</div>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Stat Card 1 */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-black">Total Jobs</h2>
                    <p className="mt-2 text-4xl font-bold text-blue-600">{jobsCount}</p>
                </div>

                {/* Stat Card 2 */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="text-lg font-medium text-black">Applications Received</h2>
                    <p className="mt-2 text-4xl font-bold text-green-600">{applicationsCount}</p>
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-xl text-black font-semibold">Quick Actions</h3>
                <div className="flex gap-4">
                    <Link href="/admin/jobs" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Manage Jobs
                    </Link>
                    <Link href="/admin/applications" className="rounded bg-gray-200 px-4 py-2 text-black hover:bg-gray-300">
                        View All Applications
                    </Link>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    salary: string | null;
    type: string;
    createdAt: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        try {
            const res = await fetch("/api/jobs");
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <p className="text-center text-gray-500">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Available Jobs</h1>
                    <p className="mt-2 text-gray-600">Browse and apply for open positions</p>
                </header>

                <div className="space-y-6">
                    {jobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/jobs/${job.id}`}
                            className="block rounded-lg bg-white p-6 shadow transition hover:shadow-lg"
                        >
                            <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                {job.location} {job.salary && `• ${job.salary}`}
                            </p>
                            <div className="mt-2">
                                <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${job.type === 'full-time' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                                    {job.type === 'full-time' ? 'Full-time' : 'Part-time'}
                                </span>
                            </div>
                            <p className="mt-3 text-gray-700 line-clamp-2">{job.description}</p>
                            <p className="mt-4 text-sm font-medium text-blue-600">
                                View details and apply →
                            </p>
                        </Link>
                    ))}

                    {jobs.length === 0 && (
                        <div className="rounded-lg bg-white p-12 text-center shadow">
                            <p className="text-gray-500">No jobs available at the moment. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

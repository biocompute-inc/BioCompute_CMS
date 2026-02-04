"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Job {
    id: string;
    title: string;
    description: string;
    whoWeAreLookingFor: string;
    howToApply: string;
    location: string;
    salary: string | null;
    type: string;
    status: string;
    createdAt: string;
    _count: {
        applications: number;
    };
}

export default function AdminJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [previewJob, setPreviewJob] = useState<Job | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        whoWeAreLookingFor: "",
        howToApply: "",
        location: "",
        salary: "",
        type: "full-time",
        status: "active"
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        try {
            const res = await fetch("/api/admin/jobs");
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            } else if (res.status === 401) {
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowCreateForm(false);
                setFormData({ title: "", description: "", whoWeAreLookingFor: "", howToApply: "", location: "", salary: "", type: "full-time", status: "active" });
                fetchJobs();
            }
        } catch (error) {
            console.error("Failed to create job", error);
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!editingJob) return;

        try {
            const res = await fetch(`/api/admin/jobs/${editingJob.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setEditingJob(null);
                setFormData({ title: "", description: "", whoWeAreLookingFor: "", howToApply: "", location: "", salary: "", type: "full-time", status: "active" });
                fetchJobs();
            }
        } catch (error) {
            console.error("Failed to update job", error);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const res = await fetch(`/api/admin/jobs/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchJobs();
            }
        } catch (error) {
            console.error("Failed to delete job", error);
        }
    }

    function startEdit(job: Job) {
        setEditingJob(job);
        setFormData({
            title: job.title,
            description: job.description,
            whoWeAreLookingFor: job.whoWeAreLookingFor,
            howToApply: job.howToApply,
            location: job.location,
            salary: job.salary || "",
            type: job.type || "full-time",
            status: job.status
        });
        setShowCreateForm(false);
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
                <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push("/admin/dashboard")}
                        className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                    >
                        ← Back to Dashboard
                    </button>
                    <button
                        onClick={() => {
                            setShowCreateForm(true);
                            setEditingJob(null);
                            setFormData({ title: "", description: "", whoWeAreLookingFor: "", howToApply: "", location: "", salary: "", type: "full-time", status: "active" });
                        }}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        + Create Job
                    </button>
                    <button
                        onClick={handleLogout}
                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {(showCreateForm || editingJob) && (
                <div className="mb-8 rounded-lg bg-white text-black p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold">
                        {editingJob ? "Edit Job" : "Create New Job"}
                    </h2>
                    <form onSubmit={editingJob ? handleUpdate : handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900\"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Job Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                rows={4}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Who Are We Looking For?</label>
                            <textarea
                                value={formData.whoWeAreLookingFor}
                                onChange={(e) => setFormData({ ...formData, whoWeAreLookingFor: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                rows={4}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">How to Apply?</label>
                            <textarea
                                value={formData.howToApply}
                                onChange={(e) => setFormData({ ...formData, howToApply: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
                            <input
                                type="text"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Job Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                            >
                                <option value="active">Active</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                {editingJob ? "Update" : "Create"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingJob(null);
                                }}
                                className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div >
            )
            }

            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {job.location} {job.salary && `• ${job.salary}`}
                                </p>
                                <p className="mt-2 text-gray-700">{job.description}</p>
                                <div className="mt-3 flex items-center gap-4 text-sm">
                                    <span className={`rounded px-2 py-1 ${job.type === 'full-time' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                                        {job.type === 'full-time' ? 'Full-time' : 'Part-time'}
                                    </span>
                                    <span className={`rounded px-2 py-1 ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {job.status}
                                    </span>
                                    <span className="text-gray-500">
                                        {job._count.applications} applications
                                    </span>
                                </div>
                            </div>
                            <div className="ml-4 flex gap-2">
                                <button
                                    onClick={() => setPreviewJob(job)}
                                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => startEdit(job)}
                                    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-gray-500">No jobs yet. Create your first job posting!</p>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-8 shadow-xl">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{previewJob.title}</h2>
                                <p className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                                    <span>📍 {previewJob.location}</span>
                                    {previewJob.salary && <span>💰 {previewJob.salary}</span>}
                                    <span className={`rounded px-2 py-1 text-xs font-medium ${previewJob.type === 'full-time' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                                        {previewJob.type === 'full-time' ? 'Full-time' : 'Part-time'}
                                    </span>
                                    <span className={`rounded px-2 py-1 text-xs font-medium ${previewJob.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {previewJob.status.charAt(0).toUpperCase() + previewJob.status.slice(1)}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={() => setPreviewJob(null)}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Job Description */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Job Description</h3>
                                <p className="whitespace-pre-line text-gray-700">{previewJob.description}</p>
                            </div>

                            {/* Who We Are Looking For */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Who We Are Looking For</h3>
                                <p className="whitespace-pre-line text-gray-700">{previewJob.whoWeAreLookingFor}</p>
                            </div>

                            {/* How to Apply */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">How to Apply</h3>
                                <p className="whitespace-pre-line text-gray-700">{previewJob.howToApply}</p>
                            </div>

                            {/* Statistics */}
                            <div className="rounded-lg border border-gray-200 bg-blue-50 p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Application Statistics</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-blue-600">{previewJob._count.applications}</span>
                                    <span className="text-gray-700">applications received</span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    Posted on: {new Date(previewJob.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 border-t pt-6">
                                <button
                                    onClick={() => {
                                        startEdit(previewJob);
                                        setPreviewJob(null);
                                    }}
                                    className="flex-1 rounded bg-yellow-500 px-6 py-3 text-white hover:bg-yellow-600"
                                >
                                    Edit Job
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(previewJob.id);
                                        setPreviewJob(null);
                                    }}
                                    className="rounded bg-red-500 px-6 py-3 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setPreviewJob(null)}
                                    className="rounded bg-gray-200 px-6 py-3 text-gray-800 hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}

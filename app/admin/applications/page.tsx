"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Application {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    linkedIn: string;
    resume: string;
    coverLetter: string | null;
    status: string;
    appliedAt: string;
    job: {
        title: string;
        location: string;
    };
}

export default function AdminApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            const res = await fetch("/api/admin/applications");
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            } else if (res.status === 401) {
                router.push("/admin/login");
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: string) {
        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                fetchApplications();
            }
        } catch (error) {
            console.error("Failed to update application", error);
        }
    }

    async function deleteApplication(id: string) {
        if (!confirm("Are you sure you want to delete this application?")) return;

        try {
            const res = await fetch(`/api/admin/applications/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchApplications();
            }
        } catch (error) {
            console.error("Failed to delete application", error);
        }
    }

    const filteredApplications = filter === "all"
        ? applications
        : applications.filter(app => app.status === filter);

    if (loading) {
        return <div className="min-h-screen bg-gray-50 p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                <p className="mt-2 text-gray-600">Manage job applications from candidates</p>
            </header>

            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`rounded px-4 py-2 ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    All ({applications.length})
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`rounded px-4 py-2 ${filter === "pending" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    Pending ({applications.filter(a => a.status === "pending").length})
                </button>
                <button
                    onClick={() => setFilter("reviewed")}
                    className={`rounded px-4 py-2 ${filter === "reviewed" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    Reviewed ({applications.filter(a => a.status === "reviewed").length})
                </button>
                <button
                    onClick={() => setFilter("accepted")}
                    className={`rounded px-4 py-2 ${filter === "accepted" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    Accepted ({applications.filter(a => a.status === "accepted").length})
                </button>
                <button
                    onClick={() => setFilter("rejected")}
                    className={`rounded px-4 py-2 ${filter === "rejected" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                >
                    Rejected ({applications.filter(a => a.status === "rejected").length})
                </button>
            </div>

            <div className="space-y-4">
                {filteredApplications.map((app) => (
                    <div key={app.id} className="rounded-lg bg-white p-6 shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-semibold text-gray-900">{app.fullName}</h3>
                                    <span className={`rounded px-2 py-1 text-xs font-medium ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                            app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </span>
                                </div>
                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                    <p>📧 {app.email}</p>
                                    <p>📞 {app.phone}</p>
                                    <p>🔗 <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">LinkedIn Profile</a></p>
                                </div>
                                <p className="mt-3 text-sm text-gray-700">
                                    Applied for: <span className="font-medium">{app.job.title}</span> ({app.job.location})
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                                <div className="mt-3 flex gap-3">
                                    <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        📄 View Resume →
                                    </a>
                                </div>
                                {app.coverLetter && (
                                    <div className="mt-3 rounded bg-gray-50 p-3">
                                        <p className="text-xs font-medium text-gray-700">Cover Letter:</p>
                                        <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{app.coverLetter}</p>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                                <select
                                    value={app.status}
                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                    className="rounded border px-3 py-1 text-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <button
                                    onClick={() => deleteApplication(app.id)}
                                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredApplications.length === 0 && (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-gray-500">
                            {filter === "all"
                                ? "No applications yet."
                                : `No ${filter} applications.`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

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
    comments: Comment[];
    _count: {
        comments: number;
    };
}

interface Comment {
    id: string;
    applicationId: string;
    adminEmail: string;
    comment: string;
    fitmentTag: string | null;
    createdAt: string;
}

export default function AdminApplicationsPage() {
    const router = useRouter();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [fitmentFilter, setFitmentFilter] = useState<string>("all");
    const [previewApp, setPreviewApp] = useState<Application | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [fitmentTag, setFitmentTag] = useState<string>("");

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

    async function fetchComments(applicationId: string) {
        setLoadingComments(true);
        try {
            const res = await fetch(`/api/admin/applications/${applicationId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoadingComments(false);
        }
    }

    async function addComment(applicationId: string) {
        if (!newComment.trim()) return;

        try {
            const res = await fetch(`/api/admin/applications/${applicationId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: newComment, fitmentTag: fitmentTag || null }),
            });

            if (res.ok) {
                setNewComment("");
                setFitmentTag("");
                fetchComments(applicationId);
            }
        } catch (error) {
            console.error("Failed to add comment", error);
        }
    }

    function openPreview(app: Application) {
        setPreviewApp(app);
        fetchComments(app.id);
    }

    // Get unique job titles for role filter
    const uniqueRoles = Array.from(new Set(applications.map(app => app.job.title)));

    const filteredApplications = applications.filter(app => {
        const statusMatch = filter === "all" || app.status === filter;
        const roleMatch = roleFilter === "all" || app.job.title === roleFilter;
        const latestComment = app.comments && app.comments.length > 0 ? app.comments[0] : null;
        const fitmentMatch = fitmentFilter === "all" ||
            (fitmentFilter === "untagged" && (!latestComment || !latestComment.fitmentTag)) ||
            (latestComment && latestComment.fitmentTag === fitmentFilter);
        return statusMatch && roleMatch && fitmentMatch;
    });

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
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                        <p className="mt-2 text-gray-600">Manage job applications from candidates</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => router.push("/admin/dashboard")}
                            className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                        >
                            ← Back to Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Role Filter */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Role:</label>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-900"
                >
                    <option value="all">All Roles ({applications.length})</option>
                    {uniqueRoles.map(role => (
                        <option key={role} value={role}>
                            {role} ({applications.filter(a => a.job.title === role).length})
                        </option>
                    ))}
                </select>
            </div>

            {/* Fitment Filter */}
            <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Fitment:</label>
                <select
                    value={fitmentFilter}
                    onChange={(e) => setFitmentFilter(e.target.value)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-900"
                >
                    <option value="all">All Fitments</option>
                    <option value="excellent">⭐ Excellent Fit</option>
                    <option value="good">✅ Good Fit</option>
                    <option value="average">➖ Average Fit</option>
                    <option value="poor">❌ Poor Fit</option>
                    <option value="untagged">📝 Untagged</option>
                </select>
            </div>

            {/* Status Filter */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`rounded px-4 py-2 ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
                >
                    All ({applications.length})
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`rounded px-4 py-2 ${filter === "pending" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
                >
                    Pending ({applications.filter(a => a.status === "pending").length})
                </button>
                <button
                    onClick={() => setFilter("reviewed")}
                    className={`rounded px-4 py-2 ${filter === "reviewed" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
                >
                    Reviewed ({applications.filter(a => a.status === "reviewed").length})
                </button>
                <button
                    onClick={() => setFilter("accepted")}
                    className={`rounded px-4 py-2 ${filter === "accepted" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
                >
                    Accepted ({applications.filter(a => a.status === "accepted").length})
                </button>
                <button
                    onClick={() => setFilter("rejected")}
                    className={`rounded px-4 py-2 ${filter === "rejected" ? "bg-blue-600 text-white" : "bg-white text-black"}`}
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
                                <p className="mt-3 text-sm text-black">
                                    Applied for: <span className="font-medium">{app.job.title}</span> ({app.job.location})
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                                </p>

                                {/* Comments and Fitment Display */}
                                {app.comments && app.comments.length > 0 && (
                                    <div className="mt-3 rounded-lg border border-gray-300 bg-blue-50 p-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                {app.comments[0].fitmentTag && (
                                                    <span className={`inline-block rounded px-2 py-1 text-xs font-medium mb-2 ${app.comments[0].fitmentTag === 'excellent' ? 'bg-green-100 text-green-800' :
                                                            app.comments[0].fitmentTag === 'good' ? 'bg-blue-100 text-blue-800' :
                                                                app.comments[0].fitmentTag === 'average' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                        }`}>
                                                        {app.comments[0].fitmentTag === 'excellent' ? '⭐ Excellent' :
                                                            app.comments[0].fitmentTag === 'good' ? '✅ Good' :
                                                                app.comments[0].fitmentTag === 'average' ? '➖ Average' :
                                                                    '❌ Poor'}
                                                    </span>
                                                )}
                                                <p className="text-xs text-gray-700 line-clamp-2">
                                                    <span className="font-medium">Latest: </span>{app.comments[0].comment}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {app._count.comments} comment{app._count.comments !== 1 ? 's' : ''} • {app.comments[0].adminEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                        <p className="text-xs font-medium text-black">Cover Letter:</p>
                                        <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{app.coverLetter}</p>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex flex-col gap-2">
                                <button
                                    onClick={() => openPreview(app)}
                                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                                >
                                    Preview
                                </button>
                                <select
                                    value={app.status}
                                    onChange={(e) => updateStatus(app.id, e.target.value)}
                                    className="rounded text-black border px-3 py-1 text-sm"
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
                            {filter === "all" && roleFilter === "all" && fitmentFilter === "all"
                                ? "No applications yet."
                                : "No applications match the selected filters."}
                        </p>
                    </div>
                )}
            </div>

            {/* Preview Modal */}
            {previewApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-8 shadow-xl">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{previewApp.fullName}</h2>
                                <p className="mt-1 text-sm text-gray-600">Application Preview</p>
                            </div>
                            <button
                                onClick={() => setPreviewApp(null)}
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div>
                                <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${previewApp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    previewApp.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                        previewApp.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {previewApp.status.charAt(0).toUpperCase() + previewApp.status.slice(1)}
                                </span>
                            </div>

                            {/* Contact Information */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-3 font-semibold text-gray-900">Contact Information</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700"><span className="font-medium">Email:</span> {previewApp.email}</p>
                                    <p className="text-gray-700"><span className="font-medium">Phone:</span> {previewApp.phone}</p>
                                    <p className="text-gray-700">
                                        <span className="font-medium">LinkedIn:</span>{" "}
                                        <a href={previewApp.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            View Profile →
                                        </a>
                                    </p>
                                </div>
                            </div>

                            {/* Job Details */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-3 font-semibold text-gray-900">Applied Position</h3>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-700"><span className="font-medium">Role:</span> {previewApp.job.title}</p>
                                    <p className="text-gray-700"><span className="font-medium">Location:</span> {previewApp.job.location}</p>
                                    <p className="text-gray-700"><span className="font-medium">Applied on:</span> {new Date(previewApp.appliedAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            {previewApp.coverLetter && (
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h3 className="mb-3 font-semibold text-gray-900">Cover Letter</h3>
                                    <p className="whitespace-pre-line text-sm text-gray-700">{previewApp.coverLetter}</p>
                                </div>
                            )}

                            {/* Resume Link */}
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-3 font-semibold text-gray-900">Resume</h3>
                                <a
                                    href={previewApp.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    📄 Open Resume in New Tab →
                                </a>
                            </div>

                            {/* Comments Section */}
                            <div className="rounded-lg border border-gray-300 bg-white p-4">
                                <h3 className="mb-3 font-semibold text-gray-900">Comments & Fitment Assessment</h3>

                                {/* Add Comment Form */}
                                <div className="mb-4 space-y-3 rounded-lg bg-gray-50 p-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Fitment Tag</label>
                                        <select
                                            value={fitmentTag}
                                            onChange={(e) => setFitmentTag(e.target.value)}
                                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-gray-900"
                                        >
                                            <option value="">No tag</option>
                                            <option value="excellent">⭐ Excellent Fit</option>
                                            <option value="good">✅ Good Fit</option>
                                            <option value="average">➖ Average Fit</option>
                                            <option value="poor">❌ Poor Fit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Add your assessment or notes..."
                                            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                                            rows={3}
                                        />
                                    </div>
                                    <button
                                        onClick={() => addComment(previewApp.id)}
                                        disabled={!newComment.trim()}
                                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        Add Comment
                                    </button>
                                </div>

                                {/* Comments List */}
                                {loadingComments ? (
                                    <p className="text-center text-gray-500">Loading comments...</p>
                                ) : comments.length > 0 ? (
                                    <div className="space-y-3">
                                        {comments.map((comment) => (
                                            <div key={comment.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        {comment.fitmentTag && (
                                                            <span className={`inline-block rounded px-2 py-1 text-xs font-medium mb-2 ${comment.fitmentTag === 'excellent' ? 'bg-green-100 text-green-800' :
                                                                comment.fitmentTag === 'good' ? 'bg-blue-100 text-blue-800' :
                                                                    comment.fitmentTag === 'average' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                                }`}>
                                                                {comment.fitmentTag === 'excellent' ? '⭐ Excellent Fit' :
                                                                    comment.fitmentTag === 'good' ? '✅ Good Fit' :
                                                                        comment.fitmentTag === 'average' ? '➖ Average Fit' :
                                                                            '❌ Poor Fit'}
                                                            </span>
                                                        )}
                                                        <p className="text-sm text-gray-700">{comment.comment}</p>
                                                        <p className="mt-2 text-xs text-gray-500">
                                                            By {comment.adminEmail} • {new Date(comment.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No comments yet. Be the first to add an assessment!</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 border-t pt-6">
                                <select
                                    value={previewApp.status}
                                    onChange={(e) => {
                                        updateStatus(previewApp.id, e.target.value);
                                        setPreviewApp(null);
                                    }}
                                    className="flex-1 rounded border border-gray-300 bg-white px-4 py-2 text-gray-900"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <button
                                    onClick={() => {
                                        deleteApplication(previewApp.id);
                                        setPreviewApp(null);
                                    }}
                                    className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setPreviewApp(null)}
                                    className="rounded bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

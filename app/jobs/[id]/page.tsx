"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Job {
    id: string;
    title: string;
    description: string;
    whoWeAreLookingFor: string;
    howToApply: string;
    location: string;
    salary: string | null;
    type: string;
    createdAt: string;
}

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        linkedIn: "",
        resume: "",
        coverLetter: ""
    });

    useEffect(() => {
        fetchJob();
    }, []);

    async function fetchJob() {
        try {
            const res = await fetch(`/api/jobs/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setJob(data);
            } else {
                router.push("/jobs");
            }
        } catch (error) {
            console.error("Failed to fetch job", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: params.id,
                    ...formData
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ fullName: "", email: "", phone: "", linkedIn: "", resume: "", coverLetter: "" });
            } else {
                alert("Failed to submit application. Please try again.");
            }
        } catch (error) {
            console.error("Failed to submit application", error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="mx-auto max-w-4xl">
                    <p className="text-center text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-4xl">
                <button
                    onClick={() => router.push("/jobs")}
                    className="mb-6 text-blue-600 hover:text-blue-800"
                >
                    ← Back to all jobs
                </button>

                <div className="rounded-lg bg-white p-8 shadow">
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="mt-2 text-gray-600">
                        {job.location} {job.salary && `• ${job.salary}`}
                    </p>
                    <div className="mt-2">
                        <span className={`inline-block rounded px-3 py-1 text-sm font-medium ${job.type === 'full-time' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                            {job.type === 'full-time' ? 'Full-time' : 'Part-time'}
                        </span>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
                            <p className="mt-2 whitespace-pre-line text-gray-700">{job.description}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Who Are We Looking For?</h2>
                            <p className="mt-2 whitespace-pre-line text-gray-700">{job.whoWeAreLookingFor}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">How to Apply?</h2>
                            <p className="mt-2 whitespace-pre-line text-gray-700">{job.howToApply}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-lg bg-white p-8 shadow">
                    <h2 className="text-2xl font-bold text-gray-900">Apply for this position</h2>

                    {success ? (
                        <div className="mt-6 rounded-lg bg-green-50 p-6 text-center">
                            <p className="text-lg font-semibold text-green-800">
                                Application submitted successfully!
                            </p>
                            <p className="mt-2 text-green-700">
                                We&apos;ll review your application and get back to you soon.
                            </p>
                            <button
                                onClick={() => router.push("/jobs")}
                                className="mt-4 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                            >
                                Browse more jobs
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                    placeholder="+1 (555) 123-4567"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    LinkedIn Profile *
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedIn}
                                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                                    className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Resume (URL) *
                                </label>
                                <input
                                    type="url"
                                    value={formData.resume}
                                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                                    className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                    placeholder="https://drive.google.com/..."
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Provide a link to your resume (Google Drive, Dropbox, etc.)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Cover Letter (Optional)
                                </label>
                                <textarea
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    className="mt-1 w-full rounded border px-3 py-2 text-gray-900"
                                    rows={6}
                                    placeholder="Tell us why you're interested in this position..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {submitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

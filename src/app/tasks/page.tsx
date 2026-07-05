"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

export default function TasksPage() {
    const router = useRouter();

    const [tasks, setTasks] = useState<Task[]>([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editStatus, setEditStatus] = useState("Pending");
    const [filter, setFilter] = useState("ALL");

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : "";

    const filteredTasks = tasks.filter((task) => {
        if (filter === "ALL") return true;

        return task.status?.toUpperCase() === filter.toUpperCase();
    });

    const totalCount = tasks.length;
    const completedCount = tasks.filter(
        (t) => t.status?.toUpperCase() === "COMPLETED",
    ).length;
    const pendingCount = tasks.filter(
        (t) => t.status?.toUpperCase() === "PENDING",
    ).length;
    const progressPercent =
        totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    useEffect(() => {
        if (!token) {
            router.push("/login");
            return;
        }

        getTasks();
    }, []);

    async function getTasks() {
        try {
            const response = await fetch(
                "/api/proxy/common/get?url=/tasks",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const result = await response.json();

            console.log("Tasks Response:", result);

            // Handle different response formats
            if (Array.isArray(result)) {
                setTasks(result);
            } else if (Array.isArray(result.data)) {
                setTasks(result.data);
            } else if (Array.isArray(result.data?.tasks)) {
                setTasks(result.data.tasks);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
            setTasks([]);
        }
    }

    async function createTask() {
        if (!title.trim()) return;

        try {
            const response = await fetch("/api/proxy/common/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    url: "/tasks",
                    data: {
                        title,
                        description,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            setTitle("");
            setDescription("");

            getTasks();
        } catch (error) {
            console.error(error);
        }
    }

    async function updateTask(id: number) {
        try {
            const response = await fetch("/api/proxy/common/put", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    url: `/tasks/${id}`,
                    data: {
                        title: editTitle,
                        description: editDescription,
                        status: editStatus,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            setEditingId(null);
            setEditTitle("");
            setEditDescription("");
            setEditStatus("PENDING");

            getTasks();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteTask(id: number) {
        try {
            const response = await fetch("/api/proxy/common/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    url: `/tasks/${id}`,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            getTasks();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F6F8]">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-[#1C2333] sm:text-3xl">
                            Task Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Keep track of what needs doing and what's done.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#3454D1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2c46b3] active:bg-[#25399a] sm:flex-none"
                        >
                            + Add Task
                        </button>

                        <button
                            onClick={() => {
                                localStorage.removeItem("accessToken");
                                router.push("/login");
                            }}
                            className="inline-flex flex-1 items-center justify-center rounded-lg bg-[#E1544C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c9463f] active:bg-[#b53e38] sm:flex-none"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats / Progress strip */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:mb-8 sm:p-6">
                    <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Total
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#1C2333] sm:text-2xl">
                                {totalCount}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Pending
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#E8A33D] sm:text-2xl">
                                {pendingCount}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Completed
                            </p>
                            <p className="mt-1 text-xl font-bold text-[#2FA66A] sm:text-2xl">
                                {completedCount}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Progress</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#2FA66A] transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-6 inline-flex w-full gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm sm:w-auto">

                    <button
                        onClick={() => setFilter("ALL")}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${filter === "ALL"
                            ? "bg-[#3454D1] text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        All
                    </button>

                    <button
                        onClick={() => setFilter("Pending")}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${filter === "Pending"
                            ? "bg-[#E8A33D] text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        Pending
                    </button>

                    <button
                        onClick={() => setFilter("Completed")}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${filter === "Completed"
                            ? "bg-[#2FA66A] text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        Completed
                    </button>

                </div>

                {/* Task Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-500 sm:px-6">
                                        Title
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-500 sm:px-6">
                                        Description
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-500 sm:px-6">
                                        Status
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-500 sm:px-6">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredTasks.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-10 text-center text-slate-500 sm:px-6"
                                        >
                                            No tasks found. Add one above to get
                                            started.
                                        </td>
                                    </tr>
                                )}

                                {filteredTasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="align-top transition-colors hover:bg-slate-50/60"
                                    >
                                        <td className="max-w-[200px] px-4 py-4 font-semibold text-[#1C2333] sm:px-6">
                                            <span className="line-clamp-2">
                                                {task.title}
                                            </span>
                                        </td>

                                        <td className="max-w-xs px-4 py-4 text-slate-500 sm:px-6">
                                            <span className="line-clamp-2">
                                                {task.description}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${task.status?.toUpperCase() === "COMPLETED"
                                                    ? "bg-[#2FA66A]/10 text-[#2FA66A]"
                                                    : "bg-[#E8A33D]/10 text-[#E8A33D]"
                                                    }`}
                                            >
                                                {task.status}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                                            <div className="flex justify-end gap-2">

                                                {/* {task.status !==
                                                    "Completed" && (
                                                        <button
                                                            onClick={() =>
                                                                completeTask(task)
                                                            }
                                                            className="bg-green-600 text-white px-4 py-2 rounded"
                                                        >
                                                            Complete
                                                        </button>
                                                    )} */}

                                                <button
                                                    onClick={() => {
                                                        setEditingId(task.id);
                                                        setEditTitle(task.title);
                                                        setEditDescription(
                                                            task.description,
                                                        );
                                                        setEditStatus(task.status);
                                                    }}
                                                    className="rounded-lg bg-[#3454D1]/10 px-3 py-1.5 text-xs font-semibold text-[#3454D1] transition-colors hover:bg-[#3454D1]/20"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(task)
                                                    }
                                                    className="rounded-lg bg-[#E1544C]/10 px-3 py-1.5 text-xs font-semibold text-[#E1544C] transition-colors hover:bg-[#E1544C]/20"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {isAddOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => setIsAddOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#1C2333]">
                                Add New Task
                            </h2>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Task Title"
                            className="mb-4 w-full rounded-lg border border-slate-200 bg-[#F9FAFB] p-3 text-sm text-[#1C2333] placeholder:text-slate-400 focus:border-[#3454D1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Task Description"
                            className="mb-4 w-full resize-none rounded-lg border border-slate-200 bg-[#F9FAFB] p-3 text-sm text-[#1C2333] placeholder:text-slate-400 focus:border-[#3454D1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={async () => {
                                    await createTask();
                                    setIsAddOpen(false);
                                }}
                                className="flex-1 rounded-lg bg-[#3454D1] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2c46b3]"
                            >
                                Add Task
                            </button>
                            <button
                                onClick={() => setIsAddOpen(false)}
                                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editingId !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => {
                        setEditingId(null);
                        setEditStatus("Pending");
                    }}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-[#1C2333]">
                                Edit Task
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setEditStatus("Pending");
                                }}
                                className="text-slate-400 hover:text-slate-600"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <input
                            className="mb-4 w-full rounded-lg border border-slate-200 bg-[#F9FAFB] p-3 text-sm text-[#1C2333] placeholder:text-slate-400 focus:border-[#3454D1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                            placeholder="Task Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                        />

                        <textarea
                            className="mb-4 w-full rounded-lg border border-slate-200 bg-[#F9FAFB] p-3 text-sm text-[#1C2333] placeholder:text-slate-400 focus:border-[#3454D1] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                            rows={3}
                            placeholder="Task Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />

                        <select
                            className="mb-4 w-full rounded-lg border border-slate-200 p-2 text-sm focus:border-[#3454D1] text-[#1C2333] focus:outline-none focus:ring-2 focus:ring-[#3454D1]/20"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={() => updateTask(editingId)}
                                className="flex-1 rounded-lg bg-[#3454D1] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2c46b3]"
                            >
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setEditingId(null);
                                    setEditStatus("Pending");
                                }}
                                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={() => setDeleteTarget(null)}
                >
                    <div
                        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold text-[#1C2333]">
                            Delete task?
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            "{deleteTarget.title}" will be permanently removed. This
                            can't be undone.
                        </p>

                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={async () => {
                                    await deleteTask(deleteTarget.id);
                                    setDeleteTarget(null);
                                }}
                                className="flex-1 rounded-lg bg-[#E1544C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c9463f]"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
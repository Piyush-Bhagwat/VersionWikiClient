import React, { useState, useRef, useEffect } from "react";
import {
    Users,
    UserPlus,
    X,
    Trash2,
    Shield,
    Eye,
    Mail,
    Loader,
} from "lucide-react";
import { createPortal } from "react-dom";
import api from "@/utils/api";
import { Members } from "@/utils/types";

interface Props {
    noteId: string;
    members: Members[];
    ownerId: string;
    currentUserId: string;
    onUpdate: () => void;
}

const MembersList: React.FC<Props> = ({
    noteId,
    members,
    ownerId,
    currentUserId,
    onUpdate,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [selectedRole, setSelectedRole] = useState<"viewer" | "editor">(
        "viewer"
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const isOwner = currentUserId === ownerId;
    // const activeMembers = members?.filter((m) => m.status === "active") || [];

    console.log("members: ", members);

    // Calculate dropdown position
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.right + window.scrollX - 400, // Align to right
            });
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    async function handleAddMember() {
        if (!email.trim()) {
            setError("Please enter an email address");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const endpoint =
                selectedRole === "editor"
                    ? `api/note/${noteId}/editor`
                    : `api/note/${noteId}/viewer`;

            await api.patch(endpoint, { email });
            setEmail("");
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to add member");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemoveMember(memberEmail: string) {
        setIsLoading(true);
        try {
            await api.delete(`api/note/${noteId}/member`, {
                data: { email: memberEmail },
            });
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to remove member");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleChangeRole(
        memberEmail: string,
        newRole: "viewer" | "editor"
    ) {
        setIsLoading(true);
        try {
            const endpoint =
                newRole === "editor"
                    ? `api/note/${noteId}/editor`
                    : `api/note/${noteId}/viewer`;

            await api.patch(endpoint, { email: memberEmail });
            onUpdate();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to change role");
        } finally {
            setIsLoading(false);
        }
    }

    const dropdown = isOpen ? (
        <div
            ref={dropdownRef}
            className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 w-[400px] max-h-[500px] overflow-hidden"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 9999,
            }}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <Users size={20} />
                    Members ({members.length})
                </h3>
            </div>

            {/* Add Member Section - Only for Owner */}
            {isOwner && (
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Add Member
                    </label>

                    {error && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                            <Mail
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="email"
                                placeholder="member@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleAddMember()
                                }
                                disabled={isLoading}
                                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={selectedRole}
                            onChange={(e) =>
                                setSelectedRole(
                                    e.target.value as "viewer" | "editor"
                                )
                            }
                            disabled={isLoading}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                        </select>

                        <button
                            onClick={handleAddMember}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" size={16} />
                            ) : (
                                <UserPlus size={16} />
                            )}
                            Add
                        </button>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="overflow-y-auto max-h-[300px]">
                {members.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="p-3 bg-gray-100 rounded-full mb-2">
                            <Users className="text-gray-400" size={24} />
                        </div>
                        <p className="text-gray-500 text-sm">No members yet</p>
                        {isOwner && (
                            <p className="text-gray-400 text-xs">
                                Add members to collaborate
                            </p>
                        )}
                    </div>
                ) : (
                    members.map((member) => (
                        <div
                            key={member.id._id}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {member.id.name || "Unknown User"}
                                        </p>
                                        {member.status === "pending" && (
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                                                Pending
                                            </span>
                                        )}
                                        {member.status === "removed" && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                Removed
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">
                                        {member.id.email || "No email"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 ml-3">
                                    {/* Role Selector - Only for Owner */}
                                    {isOwner ? (
                                        <select
                                            value={member.role}
                                            onChange={(e) =>
                                                handleChangeRole(
                                                    member.id.email!,
                                                    e.target.value as
                                                        | "viewer"
                                                        | "editor"
                                                )
                                            }
                                            disabled={isLoading}
                                            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            <option value="viewer">
                                                Viewer
                                            </option>
                                            <option value="editor">
                                                Editor
                                            </option>
                                        </select>
                                    ) : (
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-lg flex items-center gap-1 ${
                                                member.role === "editor"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {member.role === "editor" ? (
                                                <Shield size={12} />
                                            ) : (
                                                <Eye size={12} />
                                            )}
                                            {member.role}
                                        </span>
                                    )}

                                    {/* Remove Button - Only for Owner */}
                                    {isOwner && (
                                        <button
                                            onClick={() =>
                                                handleRemoveMember(
                                                    member.id.email!
                                                )
                                            }
                                            disabled={isLoading}
                                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            title="Remove member"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {members.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 text-center">
                        {isOwner
                            ? "You can manage member access and roles"
                            : "View only"}
                    </p>
                </div>
            )}
        </div>
    ) : null;

    return (
        <>
            {/* Members Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg transition-all hover:bg-black/5 text-zinc-600 hover:text-zinc-800 relative"
                title="Manage members"
            >
                <Users size={20} />
                {members.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-blue-600 text-white text-xs font-bold rounded-full">
                        {members.length}
                    </span>
                )}
            </button>

            {/* Render dropdown in portal */}
            {dropdown && createPortal(dropdown, document.body)}
        </>
    );
};

export default MembersList;

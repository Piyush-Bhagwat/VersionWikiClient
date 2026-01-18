import { userContext } from "@/context/userContext";
import { getDate } from "@/utils/functions";
import { colors, emptyNote, Note } from "@/utils/types";
import axios from "axios";
import { Pin, Trash, Palette, Cross, X, Calendar, Loader } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import ColorPallet from "./forms/ColorPallet";
import api from "@/utils/api";
import MembersList from "./MemberList";
import ReactMarkDown from "react-markdown";

interface prop {
    noteId: String;
    onClose: () => void;
}

interface noteMain {
    title: string;
    content: string;
    tag: string | undefined;
}

const NotePopup: React.FC<prop> = ({ noteId, onClose }) => {
    const [note, setNote] = useState<Note>(emptyNote);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState(false);
    const { user } = useContext(userContext);

    async function fetchNote() {
        const fetchedNote = await api.get(`api/note/${noteId}`);
        const noteData: Note = fetchedNote.data.data;
        setNote(noteData);
        setNewNote({
            title: noteData.title,
            content: noteData.content,
            tag: noteData.tag,
        });
        setPin(noteData.isPinned ?? false);
        setColor(colors.includes(noteData.color) ? noteData.color : "");
        setIsInitialized(true);
        if (
            user?.id == noteData.createdBy?._id ||
            noteData.members?.some(
                (m) => m.id._id == user?.id && m.role == "editor"
            )
        ) {
            setIsEditable(true);
        }
    }

    useEffect(() => {
        fetchNote();
    }, []);

    const [newNote, setNewNote] = useState<noteMain>({
        title: note.title,
        content: note.content,
        tag: note?.tag,
    });
    const [pin, setPin] = useState<boolean>(note.isPinned ?? false);
    const [loading, setLoading] = useState<boolean>(false);
    const [color, setColor] = useState<string>(
        colors.includes(note.color) ? note.color : ""
    );

    async function handleNoteUpdate() {
        if (!isEditable) return;
        await api.patch(`api/note/${noteId}`, newNote);
        console.log("saved");
        setLoading(false);
    }

    async function handleColorUpdate() {
        if (!color && !isEditable) return;

        await api.patch(`api/note/color/${noteId}`, {
            color,
        });
        console.log("color update", color);
        setLoading(false);
    }

    async function handlePin() {
        if (!isEditable) return;
        await api.patch(`api/note/pin/${noteId}`, {});
        setPin((p) => !p);
    }

    async function handleDelete() {
        if (!isEditable) return;
        await api.delete(`api/note/${noteId}`);
        onClose();
    }

    useEffect(() => {
        if (!isEditable) return;
        if (!isInitialized) return;
        setLoading(true);
        const timer = setTimeout(() => {
            handleNoteUpdate();
        }, 1000);

        return () => {
            clearTimeout(timer);
            setLoading(false);
        };
    }, [newNote]);

    useEffect(() => {
        if (!isEditable) return;
        if (!isInitialized) return;
        setLoading(true);
        const timer = setTimeout(() => {
            handleColorUpdate();
        }, 200);

        return () => {
            clearTimeout(timer);
            setLoading(false);
        };
    }, [color]);

    // Determine the base color string
    const baseColor = color || "grey";

    // Dynamic classes for the card color
    const cardBgClass = colors.includes(color) ? `bg-${color}-100` : "bg-white";

    // Pin color logic
    const pinColorClass = note.isPinned
        ? "text-red-500 hover:text-red-600"
        : "text-zinc-500 hover:text-red-500";

    // Tag background color
    const tagColor: string = color ? `bg-${baseColor}-300` : "bg-zinc-300";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div
                className={`w-full max-w-2xl max-h-[90vh] flex flex-col ${cardBgClass} rounded-2xl shadow-2xl relative overflow-hidden transition-colors duration-200`}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-black/5">
                    {/* Left: Version Badge */}
                    <div className="flex items-center gap-3">
                        <div className="text-xs px-2.5 py-1 rounded-md bg-black/10 text-zinc-700 font-medium">
                            v{note.versionCount}
                        </div>
                        {loading && (
                            <Loader
                                className="animate-spin text-zinc-600"
                                size={16}
                            />
                        )}
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex items-center gap-1">
                        {isInitialized && (
                            <MembersList
                                noteId={noteId.toString()}
                                members={note?.members || []}
                                ownerId={note.createdBy?._id || ""}
                                currentUserId={user?.id || ""}
                                onUpdate={fetchNote}
                            />
                        )}
                        <button
                            className={`p-2 rounded-lg transition-all hover:bg-black/5 ${pinColorClass}`}
                            title={note.isPinned ? "Unpin Note" : "Pin Note"}
                            onClick={handlePin}
                        >
                            <Pin
                                size={20}
                                fill={pin ? "currentColor" : "none"}
                            />
                        </button>

                        <button
                            className="p-2 rounded-lg transition-all hover:bg-black/5 text-zinc-500 hover:text-zinc-700"
                            title="Close"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Title Input */}
                    <input
                        type="text"
                        name="title"
                        className={`text-3xl font-bold w-full bg-transparent border-none focus:outline-none placeholder:text-${baseColor}-700/40 text-zinc-800`}
                        placeholder="Untitled Note"
                        readOnly={!isEditable}
                        onChange={(e) =>
                            setNewNote((p) => {
                                return { ...p, title: e.target.value };
                            })
                        }
                        value={newNote.title}
                    />

                    {/* Content Textarea */}

                    <div>
                        <textarea
                            name="content"
                            className="w-full h-full min-h-[300px] text-gray-700 text-base leading-relaxed resize-none bg-transparent focus:outline-none overflow-y-auto custom-scrollbar"
                            placeholder="Start writing your note..."
                            onChange={(e) =>
                                setNewNote((p) => {
                                    return { ...p, content: e.target.value };
                                })
                            }
                            readOnly={!isEditable}
                            value={newNote.content}
                        ></textarea>

                        <div className="prose prose-sm prose-slate max-w-none line-clamp-3">
                            <ReactMarkDown>{newNote.content}</ReactMarkDown>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-6 pt-4 border-t border-black/5 space-y-3">
                    {/* Metadata Row */}
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center gap-2">
                            {note.date && (
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {getDate(note.date)}
                                </span>
                            )}
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            <span>
                                Created by{" "}
                                <span className="font-medium text-zinc-700">
                                    {note.createdBy?.name}
                                </span>
                            </span>
                            <span>•</span>
                            <span>
                                Edited by{" "}
                                <span className="font-medium text-zinc-700">
                                    {note.lastEditedBy?.name}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between">
                        {/* Left: Tag Input */}
                        <input
                            className={`text-xs font-medium px-3 py-1.5 ${tagColor} text-zinc-800 rounded-full shadow-sm w-28 focus:outline-none focus:ring-2 focus:ring-${baseColor}-400 transition-all`}
                            placeholder="+ Add tag"
                            readOnly={!isEditable}
                            value={newNote.tag}
                            onChange={(e) =>
                                setNewNote((p) => {
                                    return { ...p, tag: e.target.value };
                                })
                            }
                        />

                        {/* Right: Action Buttons */}
                        <div className="flex items-center gap-2">
                            {isEditable && (
                                <ColorPallet
                                    selectedColor={color}
                                    onChange={(col) => setColor(col)}
                                />
                            )}

                            {isEditable && (
                                <button
                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    title="Delete Note"
                                    onClick={handleDelete}
                                >
                                    <Trash size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotePopup;

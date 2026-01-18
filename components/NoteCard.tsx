import { userContext } from "@/context/userContext";
import api from "@/utils/api";
import { getDate } from "@/utils/functions";
import { colors, Note } from "@/utils/types";
import { Pin, Trash, Calendar, PinOff, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";

interface Props {
    note: Note;
    onClick: () => void;
}

const NoteCard: React.FC<Props> = ({ note, onClick }) => {
    const cardColorClass = colors.includes(note.color)
        ? `bg-${note.color}-100 border-${note.color}-300`
        : "bg-white border-zinc-200";

    const pinColorClass = note.isPinned
        ? "text-red-500"
        : "text-zinc-400 hover:text-red-500";

    const tagColor: string = colors.includes(note.color)
        ? `bg-${note.color}-300`
        : "bg-zinc-300";
    const { user, refresh } = useContext(userContext);
    const [pin, setPin] = useState<boolean>(false);
    // const [isOwner, setIsOwner] = useState(true);

    useEffect(() => {
        setPin(note.isPinned);
    }, [note]);

    async function handleDelete() {
        await api.delete(`api/note/${note.id}`);
        refresh();
    }

    async function handlePin() {
        await api.patch(`api/note/pin/${note.id}`, {});
        setPin((p) => !p);
        refresh();
    }

    return (
        <div
            className={`group relative w-full rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${cardColorClass} border-2 overflow-hidden`}
            onClick={onClick}
        >
            {/* Header Section */}
            <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                    {/* Title */}
                    <h2 className="text-xl font-semibold text-zinc-800 truncate flex-1">
                        {note.title || "Untitled"}
                    </h2>

                    <div>
                        {user?.id != note.createdBy?._id && (
                            <Users
                                size={18}
                                data-tooltip-id="tool"
                                data-tooltip-content="shared with you"
                            />
                        )}
                        {note.isPinned && (
                            <Pin
                                className={`shrink-0 ${pinColorClass} transition-colors`}
                                size={18}
                                fill="currentColor"
                            />
                        )}
                    </div>
                </div>

                {/* Note Content Preview */}
                <div className="text-gray-700 text-sm leading-relaxed line-clamp-3 min-h-[60px]">
                    {note.content || (
                        <span className="text-gray-400 italic">No content</span>
                    )}
                </div>
            </div>

            {/* Footer Section */}
            <div className="px-5 pb-4 pt-2 border-t border-black/5">
                <div className="flex items-center justify-between gap-3">
                    {/* Left: Date */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 min-w-0">
                        {note.date && (
                            <>
                                <Calendar size={12} className="shrink-0" />
                                <span className="truncate">
                                    {getDate(note.date)}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Right: Tag */}
                    {note.tag && (
                        <span
                            className={`text-xs font-medium px-2.5 py-1 ${tagColor} text-zinc-800 rounded-full truncate max-w-[120px] shrink-0`}
                        >
                            {note.tag}
                        </span>
                    )}
                </div>
            </div>

            {user?.id == note.createdBy?._id && (
                <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <button
                        className={`p-2 rounded-lg ${
                            note.isPinned ? "bg-blue-300" : "bg-blue-50"
                        } text-blue-600 hover:bg-blue-100 transition-colors shadow-sm`}
                        data-tooltip-id="tool"
                        data-tooltip-content="Pin!"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePin();
                        }}
                    >
                        {note.isPinned ? (
                            <PinOff size={16} />
                        ) : (
                            <Pin size={16} />
                        )}
                    </button>
                    <button
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                        data-tooltip-id="tool"
                        data-tooltip-content="Delete Note"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete();
                        }}
                    >
                        <Trash size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NoteCard;

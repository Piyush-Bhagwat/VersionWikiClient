import { userContext } from "@/context/userContext";
import { Notification } from "@/utils/types";
import {
    Bell,
    Check,
    Trash2,
    UserCheck,
    UserMinus,
    UserPlus,
    UserX,
    X,
} from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
    notifications: Notification[];
    onAccept?: (notificationId: string) => void;
    onDecline?: (notificationId: string) => void;
    onDelete?: (notificationId: string) => void;
}

const NotificationDropdown: React.FC<Props> = ({
    notifications,
    onAccept,
    onDecline,
    onDelete,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const { refresh } = useContext(userContext);

    // Calculate dropdown position
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
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

    function getNotificationIcon(type: string) {
        switch (type) {
            case "note_invitation":
                return <UserPlus className="text-blue-600" size={20} />;
            case "note_removed":
                return <UserMinus className="text-red-600" size={20} />;
            case "invite_accepted":
                return <UserCheck className="text-green-600" size={20} />;
            case "invite_rejected":
                return <UserX className="text-orange-600" size={20} />;
            default:
                return <Bell className="text-gray-600" size={20} />;
        }
    }

    function getNotificationMessage(notification: Notification) {
        const { type, actorId, relatedNoteId, role } = notification;
        const noteTitle = relatedNoteId?.versionId?.title || "Untitled Note";
        const actorName = actorId?.name || "Someone";

        switch (type) {
            case "note_invitation":
                return (
                    <>
                        <span className="font-semibold">{actorName}</span>{" "}
                        invited you as a{" "}
                        <span className="font-semibold text-blue-600">
                            {role}
                        </span>{" "}
                        to <span className="font-semibold">"{noteTitle}"</span>
                    </>
                );
            case "note_removed":
                return (
                    <>
                        <span className="font-semibold">{actorName}</span>{" "}
                        removed you from{" "}
                        <span className="font-semibold">"{noteTitle}"</span>
                    </>
                );
            case "invite_accepted":
                return (
                    <>
                        <span className="font-semibold">{actorName}</span>{" "}
                        accepted your invitation to{" "}
                        <span className="font-semibold">"{noteTitle}"</span>
                    </>
                );
            case "invite_rejected":
                return (
                    <>
                        <span className="font-semibold">{actorName}</span>{" "}
                        declined your invitation to{" "}
                        <span className="font-semibold">"{noteTitle}"</span>
                    </>
                );
            default:
                return "You have a new notification";
        }
    }

    function getTimeAgo(dateString: string) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }

    function needsAction(type: string) {
        return type === "note_invitation";
    }

    const dropdown = isOpen ? (
        <div
            ref={dropdownRef}
            className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-h-[500px] overflow-hidden"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 9999,
            }}
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800">
                        Notifications
                    </h3>
                    {unreadCount > 0 && (
                        <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                            {unreadCount} new
                        </span>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[400px]">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="p-4 bg-gray-100 rounded-full mb-3">
                            <Bell className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">
                            No notifications
                        </p>
                        <p className="text-gray-400 text-sm">
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                !notification.isRead ? "bg-blue-50/50" : ""
                            }`}
                        >
                            <div className="flex gap-3">
                                {/* Icon */}
                                <div className="shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                                        {getNotificationMessage(notification)}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {getTimeAgo(notification.createdAt)}
                                    </p>

                                    {/* Action Buttons */}

                                    {!notification.isRead &&
                                        (needsAction(notification.type) ? (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => {
                                                        onAccept?.(
                                                            notification._id
                                                        );
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                                                >
                                                    <Check size={14} />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onDecline?.(
                                                            notification._id
                                                        );
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                                                >
                                                    <X size={14} />
                                                    Decline
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    onDelete?.(notification._id)
                                                }
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors mt-3"
                                            >
                                                <Trash2 size={14} />
                                                Dismiss
                                            </button>
                                        ))}
                                </div>

                                {/* Unread Indicator */}
                                {!notification.isRead && (
                                    <div className="shrink-0">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    ) : null;

    return (
        <>
            {/* Bell Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                data-tooltip-id="tool"
                data-tooltip-content="Notifications"
                className="relative flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-200 text-gray-800 rounded-full hover:shadow-sm transition-all font-medium text-sm active:scale-95"
            >
                <Bell size={18} />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Render dropdown in portal */}
            {dropdown && createPortal(dropdown, document.body)}
        </>
    );
};

export default NotificationDropdown;

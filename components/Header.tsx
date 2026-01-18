import { userContext } from "@/context/userContext";
import api from "@/utils/api";
import { Notification } from "@/utils/types";
import { AxiosResponse } from "axios";
import {
    Bell,
    BellDotIcon,
    BellIcon,
    LogOut,
    Notebook,
    Search,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import NotificationDropdown from "./NotificationDrawer";

const Header: React.FC = () => {
    const {
        refreshVal,
        refresh,
        search,
        setSearch,
        notes,
        user,
        handleLogout,
    } = useContext(userContext);

    const [notifications, setNotification] = useState<Notification[]>([]);

    async function fetchNotifications() {
        const res: AxiosResponse = await api.get("api/user/notifications");

        setNotification(res.data.data);
    }

    async function onInviteAccept(id: string) {
        await api.post(`api/user/notification/${id}/accept`);
        refresh();
    }
    async function onInviteDecline(id: string) {
        await api.post(`api/user/notification/${id}/decline`);
        refresh();
    }

    async function onNotificationDismiss(id: string) {
        await api.patch(`api/user/notification/${id}/read`);
        refresh();
    }

    useEffect(() => {
        fetchNotifications();
    }, [refreshVal]);

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Welcome Message */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Notebook className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Welcome back,{" "}
                                <span className="text-blue-600">
                                    {user?.name}
                                </span>
                            </h1>

                            <p className="text-sm text-gray-500">
                                {notes.length}{" "}
                                {notes.length === 1 ? "note" : "notes"} total
                            </p>
                        </div>
                    </div>

                    {/* Search and Logout */}
                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <NotificationDropdown
                            notifications={notifications}
                            onAccept={onInviteAccept}
                            onDecline={onInviteDecline}
                            onDelete={onNotificationDismiss}
                        />

                        <div className="relative w-full sm:w-80">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search your notes..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                            />
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

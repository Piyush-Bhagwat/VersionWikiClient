"use client";
import api from "@/utils/api";
import { Note, User } from "@/utils/types";
import axios, { AxiosResponse } from "axios";
import React, { createContext, Dispatch, useEffect, useState } from "react";

export const userContext = createContext<ReturnObj>({
    user: null,
    setUser: () => {},
    handleLogout: () => {},
    refresh: () => {},
    refreshVal: 0,
    notes: [],
    setNotes: () => {},
    search: "",
    setSearch: () => {},
    isLoading: false,
    setIsLoading: () => {},
});

interface prop {
    children: React.ReactNode;
}

export interface ReturnObj {
    user: User | null;
    setUser: (user: User) => void;
    handleLogout: () => void;
    refresh: () => void;
    refreshVal: number;
    notes: Note[];
    setNotes: (note: Note[]) => void;
    search: string;
    setSearch: (text: string) => void;
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
}

const UserContextProvider: React.FC<prop> = (prop) => {
    const [user, setUser] = useState<User | null>(null);
    const [refreshVal, setRefreshVal] = useState<number>(0);
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    async function fetch() {
        setIsLoading(true);
        try {
            const data: AxiosResponse = await api.get(
                `api/note?search=${search}`
            );

            if (data.data) {
                setNotes(data.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function verifyUser(usr: User) {
        const res = await api.get(`api/auth/verify`, {
            headers: {
                Authorization: `Bearer ${usr.token}`,
            },
        });

        if (res.status == 200) {
            setUser(usr);
        } else {
            localStorage.removeItem("user");
        }
    }

    function handleLogout() {
        setUser(null);
        localStorage.removeItem("user");
    }

    useEffect(() => {
        fetch();
    }, [user, refreshVal]);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    useEffect(() => {
        const usr: User = JSON.parse(localStorage.getItem("user") || "{}");

        if (usr.token) {
            verifyUser(usr);
        }
    }, []);

    function refresh() {
        setRefreshVal(Math.random());
    }

    const res: ReturnObj = {
        user,
        setUser,
        handleLogout,
        refresh,
        refreshVal,
        notes,
        setNotes,
        setSearch,
        search,
        isLoading,
        setIsLoading,
    };

    return (
        <userContext.Provider value={res}>{prop.children}</userContext.Provider>
    );
};

export default UserContextProvider;

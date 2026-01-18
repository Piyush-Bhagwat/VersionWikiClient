export interface Note {
    title: string;
    content: string;
    isPinned: boolean;
    date: string;
    author?: string;
    tag?: string;
    color: string;
    id: string;
    versionCount?: number;
    members?: [Members];
    createdBy?: {
        _id?: string;
        name?: string;
        email?: string;
    };
    lastEditedBy?: {
        _id?: string;
        name?: string;
        email?: string;
    };
}

export interface Members {
    id: {
        _id: string;
        name: string;
        email: string;
    };
    role: "viewer" | "editor";
    status: "pending" | "active" | "removed";
}

export const emptyNote: Note = {
    title: "",
    content: "",
    color: "white",
    date: new Date().toISOString(),
    isPinned: false,
    id: "",
};

export interface User {
    name: string;
    token: string;
    id?: string;
}
export interface Notification {
    _id: string;
    recipientId: string;
    type:
        | "note_invitation"
        | "note_removed"
        | "invite_accepted"
        | "invite_rejected";
    relatedNoteId: {
        _id: string;
        versionId: {
            _id: string;
            title: string;
        };
        color: string;
    };
    actorId: {
        _id: string;
        name: string;
        email: string;
    };
    role?: "viewer" | "editor" | "";
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export const emptyNotification: Notification = {
    _id: "",
    recipientId: "",
    type: "note_invitation",
    relatedNoteId: {
        _id: "",
        versionId: {
            title: "",
            _id: "",
        },
        color: "",
    },
    actorId: {
        _id: "",
        name: "",
        email: "",
    },
    role: "",
    isRead: false,
    createdAt: "",
    updatedAt: "",
};

export const colors = ["red", "blue", "green", "zinc", "yellow"];

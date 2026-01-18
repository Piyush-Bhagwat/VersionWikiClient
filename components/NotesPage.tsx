import { userContext, ReturnObj } from "@/context/userContext";
import { emptyNote, Note } from "@/utils/types";
import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import NoteCard from "./NoteCard";
import AddCard from "./AddCard";
import NotePopup from "./Note";
import { Search, LogOut, StickyNote, Notebook } from "lucide-react";
import Button from "./ui/Button";
import api from "@/utils/api";
import Header from "./Header";
import NoCards from "./NoCards";
import NoSearchCard from "./NoSearchCard";

const NotesPage: React.FC = () => {
    const context: ReturnObj = useContext(userContext);
    const [curCard, setCurCard] = useState<Note | null>(null);

    function handleCardShow(n: Note) {
        setCurCard(n);
    }
    const { notes, isLoading, search } = context;

    useEffect(() => {
        context?.refresh();
    }, [curCard, search]);

    // Separate pinned and unpinned notes
    const pinnedNotes = notes.filter((n) => n.isPinned);
    const unpinnedNotes = notes.filter((n) => !n.isPinned);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            {curCard && (
                <NotePopup
                    noteId={curCard.id}
                    onClose={() => setCurCard(null)}
                />
            )}

            {/* Header Section */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && notes.length === 0 && !search && (
                    <NoCards setCurCard={setCurCard} />
                )}

                {/* No Search Results */}
                {!isLoading && notes.length === 0 && search && <NoSearchCard />}

                {/* Notes Grid */}
                {!isLoading && notes.length > 0 && (
                    <div className="space-y-8">
                        {/* Pinned Notes Section */}
                        {pinnedNotes.length > 0 && (
                            <section>
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-8 h-0.5 bg-gray-300"></span>
                                    Pinned Notes
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {pinnedNotes.map((n) => (
                                        <NoteCard
                                            note={n}
                                            onClick={() => handleCardShow(n)}
                                            key={n.id}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* All Notes Section */}
                        <section>
                            {pinnedNotes.length > 0 && (
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="w-8 h-0.5 bg-gray-300"></span>
                                    All Notes
                                </h2>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                <AddCard
                                    onClick={(newCard: Note) => {
                                        setCurCard(newCard);
                                    }}
                                />
                                {unpinnedNotes.map((n) => (
                                    <NoteCard
                                        note={n}
                                        onClick={() => handleCardShow(n)}
                                        key={n.id}
                                    />
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotesPage;

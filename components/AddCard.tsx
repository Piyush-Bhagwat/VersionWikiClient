import { userContext } from "@/context/userContext";
import api from "@/utils/api";
import { emptyNote, Note } from "@/utils/types";
import axios, { AxiosResponse } from "axios";
import { Plus, Loader } from "lucide-react";
import React, { useContext, useState } from "react";

interface prop {
    onClick: (n: Note) => void;
}

const AddCard: React.FC<prop> = ({ onClick }) => {
    const context = useContext(userContext);
    const [isCreating, setIsCreating] = useState(false);

    async function handleNewCard() {
        if (isCreating) return;

        setIsCreating(true);
        try {
            const res: AxiosResponse = await api.post("api/note", emptyNote);

            if (res) {
                const newCard: Note = res.data.data;
                onClick(newCard);
            }
        } catch (error) {
            console.error("Failed to create note:", error);
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <button
            onClick={handleNewCard}
            disabled={isCreating}
            className={`group relative w-full h-44 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white`}
        >
            <div className="flex flex-col items-center justify-center h-full gap-3">
                {isCreating ? (
                    <>
                        <Loader
                            className="text-blue-600 animate-spin"
                            size={40}
                        />
                        <span className="text-sm font-medium text-gray-600">
                            Creating note...
                        </span>
                    </>
                ) : (
                    <>
                        <div className="p-3 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
                            <Plus
                                className="text-gray-600 group-hover:text-blue-600 transition-colors"
                                size={32}
                            />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                                Create New Note
                            </span>
                            <span className="text-xs text-gray-500">
                                Click to start writing
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gray-200 group-hover:bg-blue-400 transition-colors"></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gray-200 group-hover:bg-blue-400 transition-colors"></div>
        </button>
    );
};

export default AddCard;

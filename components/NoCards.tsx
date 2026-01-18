import React from "react";
import AddCard from "./AddCard";
import { Note } from "@/utils/types";
import { StickyNote } from "lucide-react";

interface prop {
    setCurCard: (note: Note) => void;
}

const NoCards: React.FC<prop> = ({ setCurCard }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="md:w-1/3 w-full bg-blue-200">
                <AddCard
                    onClick={(newCard: Note) => {
                        setCurCard(newCard);
                    }}
                />
            </div>
            <div className="p-4 bg-gray-100 rounded-full mb-4">
                <StickyNote className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No notes yet
            </h3>
            <p className="text-gray-500 mb-6">
                Create your first note to get started
            </p>
        </div>
    );
};

export default NoCards;

import { Search } from "lucide-react";
import React from "react";

const NoSearchCard = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Search className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No results found
            </h3>
            <p className="text-gray-500">
                Try searching with different keywords
            </p>
        </div>
    );
};

export default NoSearchCard;

"use client"; // Add this directive for client-side interactivity (if needed)

import React, { useContext } from "react";

import LoginForm from "@/components/forms/LoginForm";
import { userContext } from "@/context/userContext";
import NotesPage from "@/components/NotesPage";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function App() {
    const context = useContext(userContext);
    return (
        <div>
            {context?.user != null ? <NotesPage /> : <LoginForm />}
            <Tooltip id="tool" className="rounded-lg" />;
        </div>
    );
}

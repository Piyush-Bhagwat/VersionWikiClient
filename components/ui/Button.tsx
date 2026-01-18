import React, { ReactHTMLElement } from "react";

interface prop {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<prop> = (prop) => {
  const { onClick, className, text } = prop;

  return (
    <button onClick={onClick} className={` bg-blue-200 px-4 py-1 rounded-full border-blue-300 border-2 hover:bg-blue-300 active:scale-95 cursor-pointer shadow-sm ${className}`}>
      {text}
    </button>
  );
};

export default Button;

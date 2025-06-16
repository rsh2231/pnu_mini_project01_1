'use client'
import { MouseEvent } from "react";

type Button01Color = "blue" | "orange" | "lime";

interface Button01Props {
    caption : string,
    bg_color : Button01Color,
    onClick? : (e:MouseEvent<HTMLButtonElement>) => void
}

export default function Button01({caption, bg_color, onClick}: Button01Props) {
    const bg = {
        'blue': 'bg-blue-600',
        'orange': 'bg-orange-600',
        'lime': 'bg-lime-600'
    }
    
    const bgHover = {
        'blue': 'hover:bg-blue-500',
        'orange': 'hover:bg-orange-500',
        'lime': 'hover:bg-lime-500'
    }

    return(
        <button
            onClick={onClick}
            className={`
                ${bg[bg_color]} ${bgHover[bg_color]} 
                text-white 
                font-semibold 
                rounded-md 
                px-4 py-2 
                shadow-md 
                transition-colors duration-300 ease-in-out
                focus:outline-none focus:ring-1 focus:ring-offset-1
                focus:ring-${bg_color}-400
            `}
        >
            {caption}
        </button>
    );
}

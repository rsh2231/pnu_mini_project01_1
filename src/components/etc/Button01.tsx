'use client';
import { MouseEvent } from "react";
import { glass_button_variants } from "@/styles/button";

type Button01Color = keyof typeof glass_button_variants;

interface Button01Props {
  caption: string;
  bg_color: Button01Color;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export default function Button01({ caption, bg_color, onClick, disabled = false }: Button01Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${glass_button_variants[bg_color]}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
    >
      {caption}
    </button>
  );
}

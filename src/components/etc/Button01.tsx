'use client';
import { MouseEvent } from "react";
import { glass_button_variants } from "@/styles/button";

type Button01Color = keyof typeof glass_button_variants;

interface Button01Props {
  caption: string;
  bg_color: Button01Color;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function Button01({ caption, bg_color, onClick }: Button01Props) {
  return (
    <button onClick={onClick} className={glass_button_variants[bg_color]}>
      {caption}
    </button>
  );
}

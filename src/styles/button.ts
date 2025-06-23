import { clsx } from "clsx";

const commonthings = clsx(
  "font-semibold ",
  "px-0.5 ",
  "py-2 ",
  "after:absolute",
  "z-auto",
  "text-zinc-700",
  "hover:text-white ",
  "rounded-lg ",
  "transition-all ",
  "active:shadow-xl bg-zinc-950 hover:bg-zinc-950/55 h-9 relative",
  "active:scale-95",
  "after:-inset-1",
  "after:-z-10 ",
  "hover:shadow-xl ",
  "shadow-lg ",
  "after:rounded-lg",
  "after:opacity-100 "
);

export const neon_green_button = clsx(
  commonthings,
  "bg-gradient-to-r ",
  "from-lime-300",
  "to-emerald-200",
  "hover:from-lime-500",
  "hover:to-teal-300",

  "after:animate-pulse ",
  "after:bg-gradient-to-r ",
  "after:from-lime-600",
  "after:to-indigo-500",
  "after:blur-lg"
);

export const neon_pink_button = clsx(
  commonthings,
  "bg-gradient-to-r ",
  "from-pink-500 ",
  "to-violet-500 ",
  "hover:from-pink-600 ",
  "hover:to-violet-600 ",
  "after:animate-pulse ",
  "after:bg-gradient-to-r ",
  "after:from-pink-600",
  "after:to-violet-600",
  "after:blur-lg"
);

export const neon_orange_button = clsx(
  commonthings,
  "bg-gradient-to-r ",
  "from-orange-300 ",
  "to-yellow-200 ",
  "hover:from-orange-600 ",
  "hover:to-yellow-300 ",
  "after:animate-pulse ",
  "after:bg-gradient-to-r ",
  "after:from-red-600",
  "after:to-yellow-300",
  "after:blur-lg"
);

const glassCommon = clsx(
  "px-2.5 py-1 text-xs",                             // 기본 여백 및 글자 크기
  "sm:px-3 sm:py-1.5 sm:text-sm",                   // sm 이상에서 여백 확대
  "md:px-3.5 md:py-2 md:text-sm",                   // md 이상에서 여백 더 확대

  // 너비 관련
  "w-auto",                                         // 항상 내용 길이에 맞게 너비 자동
  "min-w-0",                                        // 최소 너비 강제 제거
  "max-w-full",                                     // 너무 길어지는 경우 부모 내에서만 표시

  // 기타 디자인 요소
  "font-semibold",
  "rounded-xl",
  "backdrop-blur-md",
  "bg-white",
  "border",
  "shadow-md",
  "transition-all",
  "duration-300",
  "ease-in-out",
  "cursor-pointer",
  "focus:outline-none",
  "focus:ring-1",
  "focus:ring-offset-0",
  "disabled:opacity-50",
  "disabled:cursor-not-allowed",
  "inline-flex items-center justify-center truncate" // 정렬 및 말줄임
);

export const glass_button_variants = {
  blue: clsx(
    glassCommon,
    "text-blue-500",
    "border-blue-300",
    "hover:bg-gray-100",
    "hover:shadow-[0_0_8px_rgba(59,130,246,0.35)]",
    "focus:ring-blue-300"
  ),
  cyan: clsx(
    glassCommon,
    "text-cyan-500",
    "border-cyan-300",
    "hover:bg-gray-100",
    "hover:shadow-[0_0_8px_rgba(34,211,238,0.35)]",
    "focus:ring-cyan-300"
  ),
  orange: clsx(
    glassCommon,
    "text-orange-500",
    "border-orange-300",
    "hover:bg-gray-100",
    "hover:shadow-[0_0_8px_rgba(249,115,22,0.35)]",
    "focus:ring-orange-300"
  ),
} as const;

"use client";

import { useAppStore } from "@/store/useAppStore";

interface WishlistButtonProps {
  productId: number;
  variant?: "icon" | "button";
  className?: string;
}

export default function WishlistButton({
  productId,
  variant = "icon",
  className = "",
}: WishlistButtonProps) {
  const { wishlist, toggleWishlist, language } = useAppStore();
  const isWishlisted = wishlist.includes(productId);

  const labelAdd =
    language === "fa"
      ? "افزودن به علاقه‌مندی‌ها"
      : language === "ar"
      ? "إضافة إلى المفضلة"
      : "Add to Wishlist";

  const labelSaved =
    language === "fa"
      ? "ذخیره در علاقه‌مندی‌ها"
      : language === "ar"
      ? "في المفضلة"
      : "Saved in Wishlist";

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isWishlisted}
        aria-label={isWishlisted ? labelSaved : labelAdd}
        className={`w-full sm:w-auto py-4 px-6 border-2 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
          isWishlisted
            ? "bg-[#660000]/10 border-[#660000] text-[#660000]"
            : "bg-white border-[#C4852B]/60 text-[#1A1816] hover:border-[#660000] hover:text-[#660000]"
        } ${className}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={isWishlisted ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.6}
          stroke="currentColor"
          className={`w-4 h-4 shrink-0 ${isWishlisted ? "text-[#660000]" : "text-[#C4852B]"}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        <span>{isWishlisted ? labelSaved : labelAdd}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? labelSaved : labelAdd}
      title={isWishlisted ? labelSaved : labelAdd}
      className={`w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border transition-all flex items-center justify-center shadow-2xs cursor-pointer ${
        isWishlisted
          ? "border-[#660000]/40 text-[#660000]"
          : "border-zinc-200/80 text-zinc-500 hover:text-[#660000] hover:border-[#660000]/40"
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isWishlisted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.6}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}


"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingText,
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {pending && (
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin"
        />
      )}
      {pending ? (pendingText ?? children) : children}
    </button>
  );
}

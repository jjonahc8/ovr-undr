"use client";

import leaveLeague from "@/app/api/actions/leave-league";
import React from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createPortal } from "react-dom";

type ToastState =
  | { open: false; message: ""; kind: "success" | "error" }
  | { open: true; message: string; kind: "success" | "error" };

export default function LeaveLeagueButton({
  leagueId,
  isAdmin,
}: {
  leagueId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [toast, setToast] = React.useState<ToastState>({
    open: false,
    message: "",
    kind: "success",
  });

  const toastTimerRef = React.useRef<number | null>(null);

  const showToast = (kind: "success" | "error", message: string) => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);

    setToast({ open: true, kind, message });

    toastTimerRef.current = window.setTimeout(() => {
      setToast({ open: false, kind, message: "" });
      toastTimerRef.current = null;
    }, 2500);
  };

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const onConfirmLeave = () => {
    startTransition(async () => {
      const res = await leaveLeague(leagueId);

      if (!res.ok) {
        setConfirmOpen(false);
        showToast("error", res.message);
        return;
      }

      setConfirmOpen(false);
      showToast("success", "You left the league.");

      // give the toast a beat, then redirect
      window.setTimeout(() => {
        router.replace("/protected");
        router.refresh();
      }, 700);
    });
  };

  return (
    <>
      {/* Toast */}
      {toast.open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed top-4 right-4 z-[9999] pointer-events-none 
          animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div
              className={[
                "min-w-[260px] max-w-[320px] rounded-xl border px-4 py-3 shadow-lg backdrop-blur",
                toast.kind === "success"
                  ? "border-green-500/40 bg-black/80 text-green-300"
                  : "border-red-500/40 bg-black/80 text-red-300",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              <div className="text-sm font-semibold">
                {toast.kind === "success" ? "Success" : "Error"}
              </div>
              <div className="text-sm opacity-90">{toast.message}</div>
            </div>
          </div>,
          document.body
        )}

      {/* Button */}
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
        className="w-40 h-10 rounded-full border border-red-500 text-red-500
                   hover:bg-red-500 hover:text-black transition disabled:opacity-50"
      >
        {isPending ? "Leaving..." : "Leave League"}
      </button>

      {/* Confirmation Modal */}
      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[99] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm leaving league"
          onMouseDown={() => {
            if (!isPending) setConfirmOpen(false);
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70" />

          {/* Modal */}
          <div
            className="relative max-w-sm rounded-2xl border border-gray-700 bg-black p-6 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold">Leave league?</h2>
            <p className="mt-2 text-sm text-gray-300">
              You’ll be removed from this league and redirected to your
              dashboard.
            </p>

            {isAdmin ? (
              <p className="mt-2 text-xs text-gray-400">
                If you’re the manager, ownership will be transferred to another
                member (if possible).
              </p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setConfirmOpen(false)}
                className="h-10 px-4 rounded-full border border-gray-600 text-gray-200
                           hover:bg-white/10 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={onConfirmLeave}
                className="h-10 px-4 rounded-full border border-red-500 text-red-500
                           hover:bg-red-500 hover:text-black transition disabled:opacity-50"
              >
                {isPending ? "Leaving..." : "Yes, leave"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { DifficultyActionButton } from "@/components/ui/Buttons/DifficultyActionButton";
import React, { useEffect, useRef } from "react";

interface ConfirmationModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [visible]);

  // Auto-focus modal when opened
  useEffect(() => {
    if (visible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [visible]);


  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        onCancel();
      }
    };
    if (visible) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [visible, onCancel]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      {...(title && { "aria-labelledby": "confirmation-title" })}
      {...(message && { "aria-describedby": "confirmation-message" })}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-black p-6 w-[90%] max-w-md space-y-6 text-center text-white outline-none"
      >
        {title && (
          <h2
            id="confirmation-title"
            className="text-red-500 text-[32px] font-bold"
          >
            {title}
          </h2>
        )}
        {message && (
          <p
            id="confirmation-message"
            className="text-gray-300 text-xl leading-relaxed"
          >
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <DifficultyActionButton variant="level" onClick={onConfirm}>
            {confirmText}
          </DifficultyActionButton>
          <DifficultyActionButton variant="cancel" onClick={onCancel}>
            {cancelText}
          </DifficultyActionButton>
        </div>
      </div>
    </div>
  );
}

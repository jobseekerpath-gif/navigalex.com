import React from 'react';
import { X } from 'lucide-react';

type ModalCloseButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function ModalCloseButton({ onClick, label = 'Close popup' }: ModalCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-300 bg-slate-900 text-white shadow-lg transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
    >
      <X className="h-6 w-6" strokeWidth={3} />
    </button>
  );
}

"use client";

import { X, Loader2 } from "lucide-react";

interface ProductReportModalProps {
  isOpen: boolean;
  reason: string;
  isSubmitting: boolean;
  onClose: () => void;
  onReasonChange: (val: string) => void;
  onSubmit: () => void;
}

export default function ProductReportModal({
  isOpen,
  reason,
  isSubmitting,
  onClose,
  onReasonChange,
  onSubmit,
}: ProductReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div dir="rtl" className="w-full max-w-md rounded-2xl bg-[#F8F9FA] p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-6 top-6 text-gray-500 hover:text-black"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-center mb-6 mt-2">ابلاغ</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-3 pr-2 text-right">
            سبب الابلاغ
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-200 bg-white p-4 min-h-[160px] outline-none focus:ring-2 focus:ring-[#37bdf8]"
            placeholder="اكتب سبب الابلاغ"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
          />
        </div>

        <button
          type="button"
          disabled={isSubmitting || !reason.trim()}
          onClick={onSubmit}
          className="w-full rounded-xl bg-[#37bdf8] py-4 text-white font-bold text-lg hover:bg-sky-500 transition-colors disabled:opacity-50 flex items-center justify-center h-14"
        >
          {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "إرسال"}
        </button>
      </div>
    </div>
  );
}

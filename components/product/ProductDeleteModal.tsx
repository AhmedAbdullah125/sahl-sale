"use client";

import { X, Loader2 } from "lucide-react";

interface ProductDeleteModalProps {
  isOpen: boolean;
  isLoading: boolean;
  isAuction: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ProductDeleteModal({
  isOpen,
  isLoading,
  isAuction,
  onClose,
  onConfirm,
}: ProductDeleteModalProps) {
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

        <h2 className="text-xl font-bold text-center mb-3 mt-2">هل أنت متأكد؟</h2>
        <p className="text-center text-gray-700 mb-6">
          هل تريد حذف هذا {isAuction ? "المزاد" : "الإعلان"}؟
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-500 py-3 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "حذف"}
          </button>
        </div>
      </div>
    </div>
  );
}

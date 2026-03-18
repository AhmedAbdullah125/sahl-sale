"use client";

import Image from "next/image";
import done from "@/src/images/done.gif";

interface ProductDoneModalProps {
  isOpen: boolean;
}

export default function ProductDoneModal({ isOpen }: ProductDoneModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div dir="rtl" className="w-full max-w-96 rounded-xl bg-white px-6 py-4 text-center shadow-2xl">
        <div className="mx-auto mb-6 h-[160px] w-[160px]">
          <Image src={done} alt="done" className="h-full w-full object-contain" priority />
        </div>
        <h2 className="text-base font-bold text-zinc-900 md:text-xl">تم إرسال بلاغك بنجاح</h2>
      </div>
    </div>
  );
}

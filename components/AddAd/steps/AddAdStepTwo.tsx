'use client';

import React from "react";
import Image from "next/image";

type Category = {
  id: number;
  name: string;
  image?: string | null;
  has_children: boolean;
  sub_categories_count?: number;
  ad_form?: string;
  company_allowed?: boolean;
  supports_auction?: boolean;
  has_city?: boolean;
};

export default function AddAdStepTwo({
  options,
  selectedId,
  onPick,
}: {
  options: Category[];
  selectedId?: number | null;
  onPick: (cat: Category) => void;
}) {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="add-grid">
        {options.map((opt) => {
          const checked = selectedId === opt.id;
          return (
            <label key={opt.id} className="category-ancor" onClick={() => onPick(opt)}>
              <input type="radio" name="cat-step-2" checked={checked} readOnly />
              <figure className="category-figure">
                {opt.image ? (
                  <Image src={opt.image} alt={opt.name} width={220} height={160} />
                ) : (
                  <div className="h-[160px] w-[220px]" />
                )}
              </figure>
              <span>{opt.name}</span>
            </label>
          );
        })}
      </div>
    </form>
  );
}

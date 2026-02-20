'use client';

import React from "react";
import Image from "next/image";

type Category = {
  id: number;
  name: string;
  image?: string | null;
  has_children: boolean;
  sub_categories_count?: number;
};

export default function AddAdStepOne({
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
              <input type="radio" name="cat-step-1" checked={checked} readOnly />
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

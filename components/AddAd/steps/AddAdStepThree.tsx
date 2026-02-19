"use client";

import React from "react";
import Image from "next/image";
import { LEVEL3_BY_L2 } from "../AddAdWrapper";

export default function AddAdStepThree({
    level2,
    selected,
    onPick,
    ad,
    setAd,
}) {
    const options = level2 ? LEVEL3_BY_L2[level2.id] ?? [] : [];

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="add-grid">
                {options.map((opt) => {
                    const checked = selected?.id === opt.id;
                    return (
                        <label
                            key={opt.id}
                            className="category-ancor"
                            onClick={() => {
                                setAd((prev) => ({ ...prev, level3: opt }));
                                onPick(opt);
                            }}
                        >
                            <input type="radio" name="cat-step-3" checked={checked} readOnly />
                            <figure className="category-figure">
                                <Image src={opt.img} alt={opt.label} width={220} height={160} />
                            </figure>
                            <span>{opt.label}</span>
                        </label>
                    );
                })}
            </div>
        </form>
    );
}

"use client";

import React from "react";
import Image from "next/image";
import { LEVEL2_BY_L1 } from "../AddAdWrapper";

export default function AddAdStepTwo({
    level1,
    selected,
    onPick,
    ad,
    setAd,
}) {
    const options = level1 ? LEVEL2_BY_L1[level1.id] ?? [] : [];

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
                                setAd((prev) => ({ ...prev, level2: opt }));
                                onPick(opt);
                            }}
                        >
                            <input type="radio" name="cat-step-2" checked={checked} readOnly />
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

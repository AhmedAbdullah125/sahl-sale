"use client";

import React from "react";
import Image from "next/image";
import { LEVEL1 } from "../AddAdWrapper";

export default function AddAdStepOne({
    selected,
    onPick,
    ad,
    setAd,
}) {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="add-grid">
                {LEVEL1.map((opt) => {
                    const checked = selected?.id === opt.id;
                    return (
                        <label
                            key={opt.id}
                            className="category-ancor"
                            onClick={() => {
                                setAd((prev) => ({ ...prev, level1: opt }));
                                onPick(opt);
                            }}
                        >
                            <input type="radio" name="cat-step-1" checked={checked} readOnly />
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

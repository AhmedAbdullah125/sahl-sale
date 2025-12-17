'use client';
import React, { useState } from "react";

export default function AddAdWrapper() {
    const [step, setStep] = useState(1);
    return (
        <form action="">
            <div class="add-grid">
                <label class="category-ancor">
                    <input type="radio" name="cat" id="" />
                    <figure class="category-figure">
                        <img alt="image1" src="images/category/vehicles.png" />
                    </figure>
                    <span>محركات</span>
                </label>
                <label class="category-ancor">
                    <input type="radio" name="cat" id="" />
                    <figure class="category-figure">
                        <img alt="image1" src="images/category/estate.png" />
                    </figure>
                    <span>عقارات</span>
                </label>
                <label class="category-ancor">
                    <input type="radio" name="cat" id="" />
                    <figure class="category-figure">
                        <img alt="image1" src="images/category/electronics.png" />
                    </figure>
                    <span>الكترونيات</span>
                </label>
                <label class="category-ancor">
                    <input type="radio" name="cat" id="" />
                    <figure class="category-figure">
                        <img alt="image1" src="images/category/Buy&sell.png" />
                    </figure>
                    <span>بيع وشراء</span>
                </label>
                <label class="category-ancor">
                    <input type="radio" name="cat" id="" />
                    <figure class="category-figure">
                        <img alt="image1" src="images/category/Contracting.png" />
                    </figure>
                    <span>مقاولات وحرف</span>
                </label>
            </div>
        </form>
    )
}

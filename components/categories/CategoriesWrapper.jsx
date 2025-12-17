import React from "react";
import Image from "next/image";
import Link from "next/link";

import vehicles from "@/src/images/category/vehicles.png";
import estate from "@/src/images/category/estate.png";
import electronics from "@/src/images/category/electronics.png";
import buySell from "@/src/images/category/Buy&sell.png";
import contracting from "@/src/images/category/Contracting.png";

const categories = [
    { id: "motors", label: "محركات", img: vehicles, href: "/categories/motors" },
    { id: "estate", label: "عقارات", img: estate, href: "/categories/estate" },
    { id: "electronics", label: "الكترونيات", img: electronics, href: "/categories/electronics" },
    { id: "buysell", label: "بيع وشراء", img: buySell, href: "/categories/buysell" },
    { id: "contracting", label: "مقاولات وحرف", img: contracting, href: "/categories/contracting" },
];

export default function CategoriesWrapper() {
    return (
        <div className="home-page-content">
            <section className="content-section">
                <div className="container">
                    <h3 className="page-head">الأقسام</h3>

                    <div className="category-grid">
                        {categories.map((cat) => (
                            <Link key={cat.id} href={cat.href} className="category-ancor">
                                <figure className="category-figure">
                                    <Image
                                        src={cat.img}
                                        alt={cat.label}
                                        width={220}
                                        height={160}
                                        className="h-auto w-full object-contain"
                                        priority={cat.id === "motors"}
                                    />
                                </figure>
                                <span>{cat.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

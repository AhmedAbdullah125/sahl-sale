"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, BadgeCheck, Bookmark } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import logo from "@/src/images/logo.svg";
import img1 from "@/src/images/01.jpg";
import ProductCard from "../General/ProductCard";

const PRODUCTS = [
    {
        id: "1",
        href: "#",
        img: img1,
        typeA: "ياباني",
        typeB: "لكزس",
        name: "سيارة لكزس RX 2025",
        kind: "auction",
        timer: "00:15:30",
        currentBid: "2100 د.ك",
    },
    {
        id: "2",
        href: "#",
        img: img1,
        typeA: "ياباني",
        typeB: "تويوتا",
        name: "سيارة تويوتا كامري 2024",
        kind: "sale",
        price: "950 د.ك",
        dateText: "منذ 1 يوم",
    },
    {
        id: "3",
        href: "#",
        img: img1,
        typeA: "ياباني",
        typeB: "تويوتا",
        name: "سيارة تويوتا لاندكروزر 2025",
        kind: "sale",
        price: "2800 د.ك",
        dateText: "منذ 3 أيام",
    },
    {
        id: "4",
        href: "#",
        img: img1,
        typeA: "ياباني",
        typeB: "لكزس",
        name: "سيارة لكزس كامري 2023",
        kind: "sale",
        price: "1200 د.ك",
        dateText: "منذ 5 أيام",
    },
];

export default function CompanyWrapper() {
    const [q, setQ] = useState("");
    const [tab, setTab] = useState("all");
    const [fav, setFav] = useState({}); // { [id]: boolean }

    // 4 selects
    const [sBrand, setSBrand] = useState(""); // الماركة
    const [sModel, setSModel] = useState(""); // الموديل
    const [sYear, setSYear] = useState(""); // سنة الصنع
    const [sPrice, setSPrice] = useState(""); // السعر range

    const clearFilters = () => {
        setTab("all");
        setQ("");
        setSBrand("");
        setSModel("");
        setSYear("");
        setSPrice("");
    };

    const filtered = useMemo(() => {
        const parseYear = (name) => {
            const m = String(name).match(/\b(19|20)\d{2}\b/);
            return m ? m[0] : "";
        };

        const parsePriceNumber = (p) => {
            const raw = p.kind === "auction" ? p.currentBid : p.price;
            if (!raw) return null;
            const num = Number(String(raw).replace(/[^\d.]/g, "")); // "2100 د.ك" -> 2100
            return Number.isFinite(num) ? num : null;
        };

        const parseRange = (rangeStr) => {
            if (!rangeStr) return null;
            const [a, b] = rangeStr.split("-").map((x) => Number(x));
            if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
            return { min: a, max: b };
        };

        let list = PRODUCTS;

        // tab
        if (tab !== "all") {
            list = list.filter((p) =>
                tab === "auction" ? p.kind === "auction" : p.kind === "sale"
            );
        }

        // search
        const search = q.trim();
        if (search) list = list.filter((p) => String(p.name).includes(search));

        // brand (compare with typeB)
        if (sBrand) list = list.filter((p) => p.typeB === sBrand);

        // model (simple contains)
        if (sModel) list = list.filter((p) => String(p.name).includes(sModel));

        // year (from name)
        if (sYear) list = list.filter((p) => parseYear(p.name) === sYear);

        // price range
        const range = parseRange(sPrice);
        if (range) {
            list = list.filter((p) => {
                const priceNum = parsePriceNumber(p);
                if (priceNum == null) return false;
                return priceNum >= range.min && priceNum <= range.max;
            });
        }

        return list;
    }, [q, tab, sBrand, sModel, sYear, sPrice]);

    return (
        <section className="content-section">
            <div className="container">
                {/* header */}
                <div className="upper-header">
                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => window.history.back()}
                        aria-label="Back"
                    >
                        <ArrowRight />
                    </button>
                    <h3 className="page-title">تفاصيل الحساب</h3>
                    <div className="empty" />
                </div>

                {/* company item */}
                <div className="company-item">
                    <figure>
                        <Image
                            src={logo}
                            alt="logo"
                            width={70}
                            height={70}
                            className="object-contain"
                        />
                    </figure>
                    <div className="company-info">
                        <span className="company-name">
                            شركة الخليج العربي{" "}
                            <BadgeCheck className="inline-block h-4 w-4" />
                        </span>
                        <span className="company-num">12 إعلان فعال</span>
                    </div>
                </div>

                {/* search */}
                <div className="search-custom">
                    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            className="search-input"
                            placeholder="ابحث"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="search-button"
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* filters */}
                <form className="product-filters" onSubmit={(e) => e.preventDefault()}>
                    {/* tabs */}
                    <div className="product-btn-filter pills">
                        <button
                            type="button"
                            className={`filter-btn ${tab === "all" ? "active" : ""}`}
                            onClick={() => setTab("all")}
                        >
                            الكل
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${tab === "sale" ? "active" : ""}`}
                            onClick={() => setTab("sale")}
                        >
                            بيع
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${tab === "auction" ? "active" : ""}`}
                            onClick={() => setTab("auction")}
                        >
                            مزاد
                        </button>
                    </div>

                    {/* 4 selects */}
                    <div className="product-select-filter selects-row">
                        <Select value={sBrand} onValueChange={setSBrand}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="الماركة" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="تويوتا">تويوتا</SelectItem>
                                <SelectItem value="لكزس">لكزس</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sModel} onValueChange={setSModel}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="الموديل" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="كامري">كامري</SelectItem>
                                <SelectItem value="RX">RX</SelectItem>
                                <SelectItem value="لاندكروزر">لاندكروزر</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sYear} onValueChange={setSYear}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="سنة الصنع" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2023">2023</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sPrice} onValueChange={setSPrice}>
                            <SelectTrigger className="filter-select">
                                <SelectValue placeholder="السعر" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0-1000">0 - 1000</SelectItem>
                                <SelectItem value="1000-2000">1000 - 2000</SelectItem>
                                <SelectItem value="2000-3000">2000 - 3000</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* optional: clear */}
                    <div style={{ marginTop: 10 }}>
                        <Button type="button" variant="ghost" onClick={clearFilters}>
                            مسح الفلاتر
                        </Button>
                    </div>
                </form>

                {/* products */}
                <div className="product-cont">
                    <div className="product-grid">
                        {filtered.length === 0 ? (
                            <div className="rounded-lg border p-4 text-center">
                                لا توجد نتائج مطابقة
                            </div>
                        ) : (
                            filtered.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

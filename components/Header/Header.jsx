"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Bookmark, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/src/images/logo.svg";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  // Load saved mode
  useEffect(() => {
    const saved = localStorage.getItem("dark-mode") === "true";
    setIsDark(saved);
  }, []);

  // Apply to body + save
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("dark-mode", String(isDark));
  }, [isDark]);

  return (
    <>
      <header>
        <div className="header-cont">
          <div className="top-header">
            <div className="container">
              <div className="nav-header">
                <figure className="img-logo relative w-[150px] h-[50px]">
                  <Link href="/">
                    <Image
                      src={logo}
                      alt="Logo"
                      width={150}
                      height={50}
                      className="object-contain"
                      priority
                    />
                  </Link>
                </figure>

                <div className="search-section">
                  <form
                    className="search-form flex items-center gap-2"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input
                      className="search-input"
                      type="text"
                      name="search"
                      placeholder="ابحث"
                    />
                    <Button type="submit" size="icon" className="search-button">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                <div className="header-icons flex items-center gap-4">
                  <Link href="/favorite" className="add-to flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    <span className="user-anc">المفضلة</span>
                  </Link>

                  <Link href="/notification" className="add-to flex items-center gap-2 relative">
                    <Bell className="h-5 w-5" />
                    <span className="user-anc">نبهني</span>
                    <span className="counter absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      1
                    </span>
                  </Link>

                  <Link href="/profile" className="add-to hide-sm flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="user-anc">الحساب</span>
                  </Link>

                  {/* Dark Mode */}
                  <div className="mode">
                    <input
                      type="checkbox"
                      className="darkmode-input hidden"
                      id="darkmode-toggle"
                      checked={isDark}
                      onChange={(e) => setIsDark(e.target.checked)}
                    />
                    <label htmlFor="darkmode-toggle" className="toggle cursor-pointer">
                      <svg
                        className={[
                          "dark-mode-toggle__icon",
                          !isDark ? "dark-mode-toggle__icon--moon" : "",
                        ].join(" ")}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <defs>
                          <mask id="mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <circle
                              className="dark-mode-toggle__cut-out"
                              r="6"
                              cx="24"
                              cy="10"
                              fill="black"
                            />
                          </mask>
                        </defs>

                        <circle
                          className="dark-mode-toggle__center-circle"
                          r="6"
                          cx="12"
                          cy="12"
                          fill="currentColor"
                          mask="url(#mask)"
                        />

                        <g
                          className="dark-mode-toggle__rays"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <line x1="12" x2="12" y1="3" y2="1" />
                          <line x1="21" x2="23" y1="12" y2="12" />
                          <line x1="12" x2="12" y1="21" y2="23" />
                          <line x1="1" x2="3" y1="12" y2="12" />
                        </g>

                        <g
                          className="dark-mode-toggle__rays"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          transform="rotate(45 12 12)"
                        >
                          <line x1="12" x2="12" y1="3" y2="1" />
                          <line x1="21" x2="23" y1="12" y2="12" />
                          <line x1="12" x2="12" y1="21" y2="23" />
                          <line x1="1" x2="3" y1="12" y2="12" />
                        </g>
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="overlay-box2"></div>
          </div>

          <nav>
            <div className="container">
              <div className="navgition">
                <ul className="big-menu list-unstyled flex gap-4">
                  <li className="cat-li">
                    <Link href="/" className="cat-anchor">الرئيسية</Link>
                  </li>
                  <li className="cat-li">
                    <Link href="/categories" className="cat-anchor">الأقسام</Link>
                  </li>
                  <li className="cat-li">
                    <Link href="/add-ad" className="cat-anchor">أضف اعلان</Link>
                  </li>
                  <li className="cat-li">
                    <Link href="#" className="cat-anchor">المزادات</Link>
                  </li>

                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* bottom menu (unchanged) */}
      <div className="menu-bar">
        <div>
          <Link href="/" className="active">
            <i className="fa-solid fa-house"></i>
            <span>الرئيسية</span>
          </Link>
        </div>
        <div>
          <Link href="/categories">
            <i className="fa-solid fa-grid-2"></i>
            <span>الأقسام</span>
          </Link>
        </div>
        <div>
          <Link href="/add-ad" className="add-icon">
            <span className="add-plus">
              <i className="fa-solid fa-plus"></i>
            </span>
            <span>أضف</span>
          </Link>
        </div>
        <div>
          <Link href="#">
            <i className="fa-solid fa-gavel"></i>
            <span>المزادات</span>
          </Link>
        </div>
        <div>
          <Link href="/profile">
            <i className="fa-solid fa-circle-user"></i>
            <span>الحساب</span>
          </Link>
        </div>
      </div>
    </>
  );
}

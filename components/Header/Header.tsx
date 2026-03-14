"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, Bookmark, User, Loader2, X } from "lucide-react";
import { useGetAds } from "@/src/hooks/useGetAds";
import { Input } from "@/components/ui/input";
import logo from "@/src/images/logo.png";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNavFixed, setIsNavFixed] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastScrollY = useRef(0);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 500);
    return () => clearTimeout(timer);
  }, [q]);

  const { data, isLoading } = useGetAds({
    page: 1,
    search: debouncedQ,
  });

  const searchResults = data?.items || [];

  // Load saved mode (client-only)
  useEffect(() => {
    const saved = localStorage.getItem("dark-mode") === "true";
    setIsDark(saved);
  }, []);

  // Apply to body + save (client-only)
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("dark-mode", String(isDark));
  }, [isDark]);

  // Fixed nav-header: visible only when scrolled > 500px AND scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingUp = currentY < lastScrollY.current;
      setIsNavFixed(currentY > 500 && scrollingUp);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasQuery = q.trim().length > 0;

  const handleClearOrOpen = () => {
    if (!hasQuery) {
      setIsDropdownOpen(false);
      inputRef.current?.focus();
      return;
    }
    setQ("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };
  const pathname = usePathname();
  return (
    <>
      <header>
        <div className="header-cont">
          <div className="top-header">
            <div className="container">
              <div className={`nav-header${isNavFixed ? " nav-header--fixed" : ""}`}>
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

                <div className="search-section relative">
                  {
                    pathname == "/" ?

                      <form
                        className="search-form flex items-center gap-2 w-full"
                        onSubmit={(e) => e.preventDefault()}
                      >
                        <Input
                          ref={inputRef}
                          className="search-input w-full"
                          type="text"
                          name="search"
                          placeholder="ابحث"
                          id="search"
                          value={q}
                          onChange={(e) => {
                            setQ(e.target.value);
                            setIsDropdownOpen(true);
                          }}
                          onFocus={() => setIsDropdownOpen(true)}
                          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                          autoComplete="off"
                        />

                        <button
                          type="button"
                          onClick={handleClearOrOpen}
                          className="search-button border-0 cursor-pointer"
                          aria-label={hasQuery ? "مسح البحث" : "بحث"}
                        >
                          {hasQuery ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                        </button>
                      </form>
                      : null
                  }

                  {/* Search Dropdown */}
                  {isDropdownOpen && hasQuery && (
                    <div className="absolute top-full right-0 mt-2 bg-background border border-border shadow-lg z-50 max-h-96 overflow-y-auto w-full md:w-[400px] rounded-[10px]">
                      {isLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="flex flex-col">
                          {searchResults.map((item: any) => (
                            <Link
                              key={item.id}
                              href={`/product/${item.id}`}
                              className="flex items-center gap-3 p-3 hover:bg-muted border-b border-border last:border-0 transition-colors"
                              onMouseDown={(e) => e.preventDefault()} // prevents blur before click navigation
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              <Image
                                src={item.image || "http://sahl.test/placeholders/logo.jpg"}
                                alt={item.title}
                                width={50}
                                height={50}
                                className="object-cover rounded-md"
                                unoptimized
                              />
                              <div className="flex flex-col flex-1">
                                <span className="text-sm font-semibold truncate text-foreground">
                                  {item.title}
                                </span>
                                {item.type === "ad" ? (
                                  <span className="text-xs text-primary font-bold">
                                    {item.price} د.ك
                                  </span>
                                ) : (
                                  <span className="text-xs text-orange-500 font-bold">
                                    بالمزاد: {item.price} د.ك
                                  </span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          لا توجد نتائج مطابقة
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="header-icons flex items-center gap-4">
                  <Link href="/favourite" className="add-to flex items-center gap-2">
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

          <div className="container">
            <nav>
              <ul className="big-menu list-unstyled flex gap-4">
                <li className="cat-li">
                  <Link href="/" className="cat-anchor">
                    الرئيسية
                  </Link>
                </li>
                <li className="cat-li">
                  <Link href="/categories" className="cat-anchor">
                    الأقسام
                  </Link>
                </li>
                <li className="cat-li">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="cat-anchor font-inherit bg-transparent border-0 cursor-pointer p-0 text-inherit w-full text-right"
                  >
                    أضف اعلان
                  </button>
                </li>
                <li className="cat-li">
                  <Link href="/auctions" className="cat-anchor">
                    المزادات
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* bottom menu (unchanged) */}
      <div className="menu-bar">
        <div>
          <Link href="/" className={pathname == "/" ? "active" : ""}>
            <i className="fa-solid fa-house"></i>
            <span>الرئيسية</span>
          </Link>
        </div>
        <div>
          <Link href="/categories" className={pathname == "/categories" ? "active" : ""}>
            <i className="fa-solid fa-grid-2"></i>
            <span>الأقسام</span>
          </Link>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="add-icon bg-transparent border-0 p-0 m-0 w-full flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="add-plus">
              <i className="fa-solid fa-plus"></i>
            </span>
            <span>أضف</span>
          </button>
        </div>
        <div>
          <Link href="/auctions" className={pathname == "/auctions" ? "active" : ""}>
            <i className="fa-solid fa-gavel"></i>
            <span>المزادات</span>
          </Link>
        </div>
        <div>
          <Link href="/profile" className={pathname == "/profile" ? "active" : ""}>
            <i className="fa-solid fa-circle-user"></i>
            <span>الحساب</span>
          </Link>
        </div>
      </div>

      {/* Add Type Selection Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 transition-opacity">
          <div
            dir="rtl"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200"
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              aria-label="إغلاق"
              type="button"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ماذا تريد أن تضيف؟</h3>
              <p className="text-gray-500 text-sm">اختر نوع الإعلان الذي ترغب في نشره</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/add-ad"
                onClick={() => setIsAddModalOpen(false)}
                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-images"></i>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-base text-gray-900 mb-1">إعلان عادي</span>
                  <span className="block text-xs text-gray-500 font-medium leading-tight">
                    بيع منتجاتك أو خدماتك بالسعر الذي تحدده
                  </span>
                </div>
              </Link>

              <Link
                href="/add-auction"
                onClick={() => setIsAddModalOpen(false)}
                className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-gavel"></i>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-base text-gray-900 mb-1">مزاد علني</span>
                  <span className="block text-xs text-gray-500 font-medium leading-tight">
                    اعرض سيارتك في مزاد علني لأعلى سعر
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
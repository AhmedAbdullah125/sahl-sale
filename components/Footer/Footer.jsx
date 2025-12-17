"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import rayanLogo from "@/src/images/rayan.png";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* footer section */}
      <footer>
        <div className="container">
          <div className="copy-flex">
            <div className="copy-right">
              جميع الحقوق محفوظة © <span>sahl sale</span>
            </div>

            <div className="design-text">
              صنع تصميم وتطوير{" "}
              <Link href="#">
                <Image
                  src={rayanLogo}
                  alt="rayan"
                  width={90}
                  height={26}
                  className="rayan-img"
                />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* arrow to top */}
      <button
        type="button"
        className="arrow-top"
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}

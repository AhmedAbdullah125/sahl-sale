import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";

import img1 from "@/src/images/01.jpg";
import img2 from "@/src/images/01.jpg";



const bids = [
  {
    href: "#",
    img: img1,
    name: "سيارة لكزس RX 2025....",
    price: "2100 د.ك",
    status: "pass",
    statusText: "✅",
    isLive: true,
  },
  {
    href: "#",
    img: img2,
    name: "سيارة لكزس RX 2025....",
    price: "2100 د.ك",
    status: "fail",
    statusText: "+ سوم",
    isLive: true,
  },
];

export default function MyBidsSection() {
  return (
    <section className="my-bids-section">
      <div className="container">
        <div className="section-head">
          <h3 className="section-title">مزايداتي</h3>
          <Link href="#" className="products-link">
            عرض الكل
          </Link>
        </div>

        <div className="grid-cont">
          {bids.map((item, idx) => (
            <Link key={idx} href={item.href} className="my-bids-item">
              <Card className="border-0 bg-transparent shadow-none">
                <div className="my-bids-flex">
                  <div className="my-bids-info">
                    <figure>
                      <Image
                        src={item.img}
                        alt="product"
                        width={80}
                        height={80}
                        className="h-auto w-auto object-cover"
                      />
                    </figure>
                    <h3 className="product-name">{item.name}</h3>
                  </div>

                  {item.isLive ? <div className="live-dot" /> : null}
                </div>

                <div className={`bids-status ${item.status}`}>
                  <span className="price">{item.price}</span>
                  <span className="status">{item.statusText}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

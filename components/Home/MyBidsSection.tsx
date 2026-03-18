import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Ad } from "@/types/home";
import { Skeleton } from "@/components/ui/skeleton";

interface MyBidsSectionProps {
  bids: Ad[];
  isLoading?: boolean;
}

export default function MyBidsSection({ bids, isLoading }: MyBidsSectionProps) {
  if (isLoading) {
    return (
      <section className="my-bids-section">
        <div className="container">
          <div className="section-head">
            <h3 className="section-title">
              <Skeleton className="h-5 w-24 rounded" />
            </h3>
            <Skeleton className="products-link h-4 w-16 rounded" />
          </div>
          <div className="grid-cont">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="my-bids-item">
                <div className="my-bids-flex">
                  <div className="my-bids-info">
                    <figure>
                      <Skeleton className="h-[80px] w-[80px] rounded" />
                    </figure>
                    <h3 className="product-name">
                      <Skeleton className="h-4 w-32 rounded mt-2" />
                    </h3>
                  </div>
                </div>
                <div className="bids-status">
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bids || bids.length === 0) return null;

  return (
    <section className="my-bids-section">
      <div className="container">
        <div className="section-head">
          <h3 className="section-title">مزايداتي</h3>
          <Link href="/profile/my-auctions" className="products-link">
            عرض الكل
          </Link>
        </div>

        <div className="grid-cont">
          {bids.map((item) => (
            <Link key={item.id} href={`/auction/${item.id}`} className="my-bids-item">
              <Card className="border-0 bg-transparent shadow-none">
                <div className="my-bids-flex">
                  <div className="my-bids-info">
                    <figure>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="h-auto w-auto object-cover"
                        />
                      ) : (
                        <div className="w-[80px] h-[80px] bg-gray-100 rounded" />
                      )}
                    </figure>
                    <h3 className="product-name">{item.title}</h3>
                  </div>

                  {item.status === "live" ? <div className="live-dot" /> : null}
                </div>

                <div className={`bids-status ${item.my_bid ? "pass" : "fail"}`}>
                  <span className="price">
                    {item.latest_bid ? item.latest_bid.amount : item.price}
                  </span>
                  <span className="status">{item.my_bid ? "✅" : "+ سوم"}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

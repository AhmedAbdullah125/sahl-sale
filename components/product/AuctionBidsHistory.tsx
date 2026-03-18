"use client";

import Image from "next/image";

interface Bid {
  id: number;
  amount: number | string;
  created_at: string;
  user?: {
    name: string;
    image?: string;
  };
}

interface AuctionBidsHistoryProps {
  bids: Bid[];
}

export default function AuctionBidsHistory({ bids }: AuctionBidsHistoryProps) {
  if (!bids || bids.length === 0) return null;

  return (
    <div className="detail-box">
      <h2 className="title">السومات :</h2>
      <div className="contributors-list">
        {bids.map((bid) => (
          <div className="contributor" key={bid.id}>
            <div className="info">
              {bid.user?.image ? (
                <Image
                  src={bid.user.image}
                  alt={bid.user.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200" />
              )}
              <div className="text">
                <strong>{bid.user?.name ?? "مجهول"}</strong>
                <small>سوم بـ {bid.amount} د.ك</small>
              </div>
            </div>
            <span className="time">{bid.created_at}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

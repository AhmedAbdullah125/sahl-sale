"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import logo from "@/src/images/logo.png";
import { AdData } from "@/src/hooks/useGetAd";

interface ProductMainInfoProps {
  ad: AdData;
  isAuction: boolean;
  isMyProduct: boolean;
  notifyBids: boolean;
  onNotifyBidsChange: (val: boolean) => void;
}

export default function ProductMainInfo({
  ad,
  isAuction,
  isMyProduct,
  notifyBids,
  onNotifyBidsChange,
}: ProductMainInfoProps) {
  return (
    <div className="detail-content">
      {/* Auction: notification toggle */}
      {isAuction && (
        <div className="item-info">
          <div className="item-content">
            <div className="item-name">تفعيل الاشعارات عند المزايدات</div>
          </div>
          <div className="item-box">
            <label className="pill">
              <input
                type="checkbox"
                checked={notifyBids}
                onChange={(e) => onNotifyBidsChange(e.target.checked)}
              />
              <span className="switch" />
            </label>
          </div>
        </div>
      )}

      {/* Auction: current bid & ends */}
      {isAuction && (
        <div className="product-info">
          <div className="product-status">
            السوم واصل : <span>{ad.latest_bid?.amount ?? ad.price} د.ك</span>
          </div>
          {ad.ended_at && (
            <div className="product-status">
              ينتهي في : <span>{ad.ended_at}</span>
            </div>
          )}
        </div>
      )}

      <div className="detail-type text-primary/80">
        {ad.parent_category && `${ad.parent_category} - `}{ad.category}
      </div>
      <h3 className="detail-name">{ad.title}</h3>
      <div className="price">{Number(ad.price)} د.ك</div>
      <div className="detail-date">نشر بتاريخ : {ad.created_at}</div>

      {!isMyProduct && ad.user && (
        <div className="company-item">
          <figure>
            <Image
              src={ad.user.image || logo}
              width={40}
              height={40}
              alt={ad.user.name}
              className="rounded-full object-cover"
              unoptimized
            />
          </figure>
          <div className="company-info">
            <span className="company-num">نشر بواسطة</span>
            <span className="company-name">
              {ad.user.name}{" "}
              {ad.user.verified_account === 1 && (
                <BadgeCheck className="inline-block h-4 w-4 text-primary" />
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

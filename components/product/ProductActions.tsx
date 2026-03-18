"use client";

import Link from "next/link";
import { PhoneCall, Loader2 } from "lucide-react";

interface ProductActionsProps {
  isAuction: boolean;
  isEnded: boolean;
  isMyProduct: boolean;
  phone?: string;
  whatsapp?: string;
  allowPhone: number;
  allowWhatsapp: number;
  bidValue: string;
  isPlacingBid: boolean;
  onBidValueChange: (val: string) => void;
  onBidSubmit: (extra?: number) => void;
  onSoldClick: () => void;
}

export default function ProductActions({
  isAuction,
  isEnded,
  isMyProduct,
  phone,
  whatsapp,
  allowPhone,
  allowWhatsapp,
  bidValue,
  isPlacingBid,
  onBidValueChange,
  onBidSubmit,
  onSoldClick,
}: ProductActionsProps) {
  return (
    <>
      {/* Auction: bid input — only for non-owner, non-ended auctions */}
      {isAuction && !isEnded && !isMyProduct && (
        <div className="auction-action">
          <div className="relative">
            <input
              type="number"
              className="!pe-14"
              placeholder="ادخل قيمة للمزايدة +"
              value={bidValue}
              onChange={(e) => onBidValueChange(e.target.value)}
              disabled={isPlacingBid}
            />
            <button
              type="button"
              className="auction-btn"
              onClick={() => onBidSubmit(0)}
              disabled={isPlacingBid}
            >
              {isPlacingBid ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "سوم"
              )}
            </button>
          </div>
          <button
            type="button"
            className="add"
            onClick={() => onBidSubmit(50)}
            disabled={isPlacingBid}
          >
            +50
          </button>
        </div>
      )}

      {/* Normal ad: contact buttons */}
      {!isAuction && (
        <div className="contact-btns">
          {allowPhone === 1 && (
            <Link href={`tel:${phone}`} className="phone-link">
              <PhoneCall className="inline-block" />
              <span>
                اتصال <span>{phone}</span>
              </span>
            </Link>
          )}

          {allowWhatsapp === 1 && whatsapp && (
            <Link
              href={`https://wa.me/${whatsapp}`}
              className="whats-link"
              target="_blank"
              rel="noreferrer"
            >
              <span>
                واتساب <span>{whatsapp}</span>
              </span>
            </Link>
          )}
        </div>
      )}

      {/* My product: sold button */}
      {isMyProduct && !isEnded && (
        <button type="button" className="form-btn" onClick={onSoldClick}>
          تم البيع
        </button>
      )}
    </>
  );
}

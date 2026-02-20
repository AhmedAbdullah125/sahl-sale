'use client';

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import vehicles from "@/src/images/category/vehicles.png";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AddAdStepFive({
  sel,
  ad,
  imagePreview,
  addons,
  setAddons,
  agree,
  setAgree,
  onPublish,
  termsHref,
  mainCategory,
  isPublishing,
}: any) {
  const publishFee = Number(mainCategory?.ad_fee ?? 0);
  const pins = (mainCategory?.active_pinning_prices ?? []) as { id: number; position: string; price: string }[];

  const pinsTotal = useMemo(() => {
    let sum = 0;
    for (const p of pins) {
      if (addons?.[p.id]) sum += Number(p.price || 0);
    }
    return sum;
  }, [pins, addons]);

  const total = publishFee + pinsTotal;

  const formatKD = (n: number) => `${Number(n).toFixed(3)} د.ك`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPublish();
      }}
    >
      <div className="product-item">
        <div className="product-img">
          <figure>
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="product"
                width={700}
                height={500}
                className="h-auto w-full object-cover"
                unoptimized
              />
            ) : (
              <Image
                src={sel.level1?.img ?? vehicles}
                alt="product"
                width={700}
                height={500}
                className="h-auto w-full object-cover"
              />
            )}
          </figure>
        </div>

        <div className="product-content">
          <div className="product-type">
            <span>{sel.level1?.name || ""}</span>
          </div>
          <h3 className="product-name">{ad.title || "عنوان الإعلان"}</h3>
          <div className="product-info">
            <span>{ad.ad_price ? `${ad.ad_price} د.ك` : "مجاني"}</span>
          </div>
        </div>
      </div>

      <div className="form-grid">
        <div className="item-info">
          <div className="item-content">
            <div className="item-name">رسوم نشر الاعلان</div>
            <div className="item-text">المدة : 1 شهر</div>
          </div>
          <div className="item-box">
            <div className="price">{formatKD(publishFee)}</div>
          </div>
        </div>

        {pins.map((p) => (
          <div key={p.id} className="item-info">
            <div className="item-content">
              <div className="item-name">تثبيت الاعلان ({p.position})</div>
              <div className="item-text">بدء التثبيت : فوراً</div>
            </div>
            <div className="item-box">
              <label className="pill">
                <input
                  type="checkbox"
                  checked={!!addons?.[p.id]}
                  onChange={(e) => setAddons((prev: any) => ({ ...prev, [p.id]: e.target.checked }))}
                />
                <div className="price">{formatKD(Number(p.price || 0))}</div>
                <span className="switch" />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="form-label">ملخص الدفع</div>

      <div className="item-info info-list">
        <div className="item">
          <span className="label">إجمالي رسوم نشر الإعلان</span>
          <span className="value">{formatKD(publishFee)}</span>
        </div>

        <div className="item">
          <span className="label">إجمالي رسوم تثبيت الإعلان</span>
          <span className="value">{formatKD(pinsTotal)}</span>
        </div>

        <div className="item total">
          <span className="label">الإجمالي</span>
          <span className="value">{formatKD(total)}</span>
        </div>
      </div>

      <div className="check-group">
        <div className="check-width">
          <label className="check-label">
            <span>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span className="checkmark custom-checkmark" />
              <span className="check-text">
                أوافق على <Link href={termsHref}>الشروط والأحكام</Link>
              </span>
            </span>
          </label>
        </div>
      </div>

      <Button className="form-btn" type="submit" disabled={!agree || isPublishing}>
        {isPublishing ? (
          <>
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            جاري النشر...
          </>
        ) : (
          "نشر الإعلان"
        )}
      </Button>
    </form>
  );
}

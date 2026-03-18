"use client";

interface Car {
  brand?: string;
  model?: string;
  year?: string | number;
}

interface ProductDetailsBoxProps {
  city?: string;
  category?: string;
  adForm?: string;
  car?: Car;
  description?: string;
}

export default function ProductDetailsBox({
  city,
  category,
  adForm,
  car,
  description,
}: ProductDetailsBoxProps) {
  return (
    <>
      {/* Details */}
      <div className="detail-box">
        <h2 className="title">التفاصيل</h2>
        <div className="row-item">
          {city && (
            <div className="detail-item">
              <span className="label">المحافظة :</span>
              <span className="value">{city}</span>
            </div>
          )}
          <div className="detail-item">
            <span className="label">القسم :</span>
            <span className="value">{category}</span>
          </div>

          {adForm === "car" && car && (
            <>
              {car.brand && (
                <div className="detail-item">
                  <span className="label">الماركة :</span>
                  <span className="value">{car.brand}</span>
                </div>
              )}
              {car.model && (
                <div className="detail-item">
                  <span className="label">الموديل :</span>
                  <span className="value">{car.model}</span>
                </div>
              )}
              {car.year && (
                <div className="detail-item">
                  <span className="label">سنة الصنع :</span>
                  <span className="value">{car.year}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="detail-box">
        <h2 className="title">الوصف :</h2>
        <p className="desc whitespace-pre-wrap">{description}</p>
      </div>
    </>
  );
}

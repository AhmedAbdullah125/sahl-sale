import { z } from "zod";

const baseSchema = z.object({
  images: z.array(z.string().min(1)).min(1, "لازم ترفع صورة واحدة على الأقل"),

  title: z.string().min(5, "العنوان قصير جداً").max(27, "الحد الأقصى 27 حرف"),

  manufacturing_country_id: z.string().optional(),
  year: z.string().optional(),

  // city is required only if has_city === true (validated in component submit)
  city_id: z.string().optional(),

  // car-only
  car_brand_id: z.string().optional(),
  car_model_id: z.string().optional(),
  mileage: z.string().optional(),

  ad_price: z
    .string()
    .optional()
    .refine((v) => !v || Number(v) >= 0, "السعر غير صالح"),

  description: z.string().min(10, "الوصف قصير جداً").max(2000, "الوصف طويل جداً"),

  allow_phone: z.boolean(),
  allow_whatsapp: z.boolean(),
  allow_notification: z.boolean(),
});

export type AddAdStepFourValues = z.infer<typeof baseSchema>;

/** Pass the current adForm so car-only fields become required when it's "car". */
export function makeAddAdStepFourSchema(adForm: "default" | "car") {
  if (adForm !== "car") return baseSchema;

  return baseSchema.superRefine((data, ctx) => {
    if (!data.manufacturing_country_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["manufacturing_country_id"],
        message: "اختر بلد الصنع",
      });
    }
    if (!data.year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["year"],
        message: "اختر سنة الصنع",
      });
    }
  });
}

/** Kept for any existing imports that reference the static export. */
export const AddAdStepFourSchema = baseSchema;

import { z } from "zod";

/** 1) Base object فقط (مهم جدًا عشان extend يشتغل) */
const BaseAdObject = z.object({
    title: z.string().min(5, "العنوان قصير جداً").max(27, "الحد الأقصى 27 حرف"),

    country: z.string().min(1, "اختر بلد الصنع"),
    brand: z.string().min(1, "اختر الماركة"),
    model: z.string().min(1, "اختر الموديل"),
    year: z.string().min(1, "اختر سنة الصنع"),

    mileage: z.string().optional(),
    governorate: z.string().optional(),

    price: z
        .string()
        .optional()
        .refine((v) => !v || Number(v) >= 0, "السعر غير صالح"),

    description: z.string().min(10, "الوصف قصير جداً").max(2000, "الوصف طويل جداً"),

    contactCall: z.boolean(),
    contactWhats: z.boolean(),
});

/** 2) Refinement مشترك */
const ContactRefine = (schema) =>
    schema.refine((data) => data.contactCall || data.contactWhats, {
        message: "اختر وسيلة تواصل واحدة على الأقل",
        path: ["contactCall"],
    });

/** ✅ Add: لازم صورة */
export const AddAdStepFourSchema = ContactRefine(
    BaseAdObject.extend({
        images: z.array(z.string().min(1)).min(1, "لازم ترفع صورة واحدة على الأقل"),
    })
);

/** ✅ Edit: نفس الـ base + section/subSection + (صور) */
export const EditAdSchema = ContactRefine(
    BaseAdObject.extend({
        section: z.string().min(1, "اختر القسم"),
        subSection: z.string().min(1, "اختر القسم الفرعي"),

        // خليها زي ما انت عايز:
        // 1) لو لازم صورة واحدة على الأقل في التعديل:
        images: z.array(z.string().min(1)).min(1, "لازم ترفع صورة واحدة على الأقل"),

        // 2) أو لو الصور اختيارية في التعديل (بدّل السطر اللي فوق بهذا):
        // images: z.array(z.string().min(1)).optional().default([]),
    })
);

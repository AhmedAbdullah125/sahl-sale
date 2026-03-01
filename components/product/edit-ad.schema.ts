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

/** ✅ Edit: optional fields to send only what changed */
export const EditAdSchema = z.object({
    title: z.string().max(27, "الحد الأقصى 27 حرف").optional().or(z.literal("")),

    country: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    year: z.string().optional(),

    mileage: z.string().optional(),
    governorate: z.string().optional(),

    price: z
        .string()
        .optional()
        .refine((v) => !v || Number(v) >= 0, "السعر غير صالح"),

    description: z.string().max(2000, "الوصف طويل جداً").optional().or(z.literal("")),

    contactCall: z.boolean().optional(),
    contactWhats: z.boolean().optional(),

    section: z.string().optional(),
    subSection: z.string().optional(),

    images: z.array(z.any()).optional(),
});

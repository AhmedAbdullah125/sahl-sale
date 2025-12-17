import { z } from "zod";

export const AddAdStepFourSchema = z
    .object({
        images: z
            .array(z.string().min(1))
            .min(1, "لازم ترفع صورة واحدة على الأقل"),

        title: z
            .string()
            .min(5, "العنوان قصير جداً")
            .max(27, "الحد الأقصى 27 حرف"),

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

        description: z
            .string()
            .min(10, "الوصف قصير جداً")
            .max(2000, "الوصف طويل جداً"),

        contactCall: z.boolean(),
        contactWhats: z.boolean(),
    })
    .refine((data) => data.contactCall || data.contactWhats, {
        message: "اختر وسيلة تواصل واحدة على الأقل",
        path: ["contactCall"],
    });

export const AddAdStepFourValues = AddAdStepFourSchema.infer;

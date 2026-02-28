import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("image");

        if (!file || typeof file === "string") {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const optimizedBuffer = await sharp(buffer)
            .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
            .png({ compressionLevel: 8 })
            .toBuffer();

        return new NextResponse(new Uint8Array(optimizedBuffer), {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Content-Length": String(optimizedBuffer.byteLength),
            },
        });
    } catch (err) {
        console.error("[optimize-image]", err);
        return NextResponse.json({ error: "Image optimization failed" }, { status: 500 });
    }
}

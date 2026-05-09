import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const fileName = `${crypto.randomUUID()}-${file.name}`;

        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
            })
        );

        const url = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${fileName}`;

        return NextResponse.json({ url });

    } catch (err) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
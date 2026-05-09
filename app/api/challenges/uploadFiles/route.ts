import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const files = form.getAll("files[]") as File[];

        const uploadedFiles = await Promise.all(
            files
                .filter(f => f && f.size > 0)
                .map(file => uploadFile(file))
        );

        const file_to_download = uploadedFiles.length > 0 ? uploadedFiles : null;

        return NextResponse.json({ success: true, files: file_to_download });
    } catch (err) {
        return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 })
    }
}

export async function uploadFile(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${randomUUID()}-${file.name.replace(/\s/g, "_")}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        })
    );

    return new URL(fileName, process.env.R2_PUBLIC_URL!).toString();
}
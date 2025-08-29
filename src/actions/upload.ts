"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface Props {
  file: File;
  path: string;
}

const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY ?? "",
    secretAccessKey: process.env.STORAGE_SECRET_KEY ?? "",
  },
});

function formatFileName(filename: string) {
  // extract extension
  const match = filename.match(/\.([^.]+)$/);
  const extension = match ? `.${match[1]}` : "";

  // remove extension from original name
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");

  // replace space or dot with underscore
  const cleanName = nameWithoutExt.replace(/[ .]/g, "-");

  return { name: `${cleanName}-${Math.floor(Date.now() / 1000)}`, extension };
}

export async function uploadFileToS3({ file, path }: Props) {
  if (!file) {
    throw new Error("Missing file");
  }

  const { name, extension } = formatFileName(file.name);

  const key = `stock-tracker/${path}/${name}${extension}`;
  const arrayBuffer = await file.arrayBuffer();
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: key,
        Body: Buffer.from(arrayBuffer),
        ContentType: file.type,
        ACL: "public-read",
      }),
    );
    const url = `https://${process.env.BUCKET_NAME}.${process.env.BUCKET_REGION}.digitaloceanspaces.com/${key}`;
    return { url };
  } catch (e) {
    throw new Error("Upload failed");
  }
}

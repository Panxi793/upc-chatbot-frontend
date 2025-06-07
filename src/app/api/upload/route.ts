import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate a unique file name
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const key = `knowledge-base/${fileName}`;

    console.log('Uploading to bucket:', process.env.AWS_S3_BUCKET);
    console.log('Upload key:', key);

    // Get the file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create the S3 upload command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    // Actually send the command to S3
    await s3Client.send(command);

    return NextResponse.json({
      file_url: key,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 
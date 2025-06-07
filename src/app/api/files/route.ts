import { NextRequest, NextResponse } from 'next/server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.S3_AWS_REGION!,
    credentials: {
        accessKeyId: process.env.S3_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { folder, fileName, fileSize, contentType } = body;

        if (!fileName) {
            return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
        }

        // Add unique identifier to prevent overwriting files with the same name
        const uniqueFileName = `${uuidv4()}-${fileName}`;

        // Sanitize the file name to remove problematic characters
        const sanitizedFileName = uniqueFileName
            .replace(/ /g, '_') // Replace spaces with underscores
            .replace(/[\u202f\u00A0]/g, '_') // Replace non-breaking spaces with underscores
            .replace(/[^\w.-]/g, '_'); // Replace any other non-alphanumeric chars except dots and hyphens

        let s3Key;

        // Handle profile pictures specially
        if (folder === 'profile-pictures/') {
            s3Key = `app-images/profile-pictures/${sanitizedFileName}`;
        } else {
            // For other files, use the normal bucket folder structure
            s3Key = `${process.env.S3_AWS_BUCKET_FOLDER}${folder || ''}${sanitizedFileName}`;
        }

        console.log('Using S3 key:', s3Key);

        // Create command for generating a presigned URL
        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.S3_AWS_BUCKET!,
            Key: s3Key,
            ContentType: contentType || 'application/octet-stream',
        });

        // Generate presigned URL for direct upload (increase timeout to 10 minutes)
        const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 600 });

        // Generate URL to get the file after upload
        const getPresignedUrl = `https://${process.env.S3_AWS_BUCKET}.s3.${process.env.S3_AWS_REGION}.amazonaws.com/${s3Key}`;

        console.log('Generated presigned URL for upload:', {
            file: sanitizedFileName,
            bucket: process.env.S3_AWS_BUCKET,
            key: s3Key,
            url: getPresignedUrl,
        });

        return NextResponse.json({
            presignedUrl,
            getPresignedUrl,
            key: sanitizedFileName,
        });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Failed to generate upload URL',
            },
            { status: 500 }
        );
    }
}

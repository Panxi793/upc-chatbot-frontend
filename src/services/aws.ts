// interface UploadResponse {
//     success: boolean;
//     url?: string;
//     error?: string;
// }

// /**
//  * Uploads a file to AWS S3
//  * @param file - The file to upload
//  * @param folder - The folder path in S3 (e.g., 'images/', 'documents/')
//  * @returns Promise<UploadResponse>
//  */
export async function uploadToS3(file: File) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Request presigned URL from the server
        // Note: With App Router, `/api/files/route` is exposed as `/api/files` in the URL
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - let the browser set it automatically with boundary
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response error:', response.status, errorText);
            throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;

        // if (data.presignedUrl) {
        //     console.log('Got presigned URL for upload:', data.presignedUrl);
        //     console.log('Will be available after upload at:', data.getPresignedUrl);

        //     // Use the presigned URL to upload the file directly to S3
        //     const uploadResponse = await fetch(data.presignedUrl, {
        //         method: 'PUT', // PUT method for direct upload
        //         body: file,
        //         headers: {
        //             'Content-Type': file.type,
        //         },
        //     });

        //     if (uploadResponse.ok) {
        //         let finalUrl = data.getPresignedUrl?.replace(/ /g, '+');

        //         // Fix potential URL encoding issues by normalizing the URL
        //         try {
        //             // First decode any encoded components to ensure we don't double-encode
        //             const decodedUrl = decodeURIComponent(finalUrl);
        //             // Then re-encode the URL properly to ensure it's valid for Django validation
        //             finalUrl = encodeURI(decodedUrl);

        //             console.log('Sanitized upload URL:', finalUrl);
        //         } catch (error) {
        //             console.warn('URL encoding issue:', error);
        //             // If encoding fails, keep the original URL
        //         }

        //         return { success: true, url: finalUrl };
        //     } else {
        //         const uploadErrorText = await uploadResponse.text();
        //         console.error('S3 upload error:', uploadResponse.status, uploadErrorText);
        //         throw new Error(
        //             `Failed to upload to S3: ${uploadResponse.status} ${uploadErrorText}`
        //         );
        //     }
        // } else {
        //     throw new Error(data.error || 'Failed to get presigned URL');
        //
    } catch (error) {
        console.error('Error in uploadToS3:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
}

// /**
//  * Uploads an image to AWS S3 with optional resizing and cropping
//  * @param file - The image file to upload
//  * @param folder - The folder path in S3 (e.g., 'images/', 'documents/')
//  * @param width - Optional width to resize/crop the image to
//  * @param height - Optional height to resize/crop the image to
//  * @returns Promise<UploadResponse>
//  */
// export async function uploadImageToS3(
//     file: File,
//     folder: string,
//     width?: number,
//     height?: number
// ): Promise<UploadResponse> {
//     try {
//         if (!file) {
//             throw new Error('No file provided');
//         }

//         // If no dimensions provided, upload original file
//         if (!width && !height) {
//             return uploadToS3(file);
//         }

//         // Create a new image element
//         const img = new Image();
//         const imageUrl = URL.createObjectURL(file);

//         // Wait for image to load
//         await new Promise((resolve, reject) => {
//             img.onload = resolve;
//             img.onerror = reject;
//             img.src = imageUrl;
//         });

//         // Create canvas and get context
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');

//         if (!ctx) {
//             throw new Error('Could not get canvas context');
//         }

//         // Set canvas dimensions
//         canvas.width = width || img.width;
//         canvas.height = height || img.height;

//         // Calculate dimensions to maintain aspect ratio
//         let drawWidth = canvas.width;
//         let drawHeight = canvas.height;
//         let offsetX = 0;
//         let offsetY = 0;

//         const aspectRatio = img.width / img.height;
//         const targetAspectRatio = canvas.width / canvas.height;

//         if (aspectRatio > targetAspectRatio) {
//             // Image is wider than target
//             drawHeight = canvas.height;
//             drawWidth = drawHeight * aspectRatio;
//             offsetX = (drawWidth - canvas.width) / 2;
//         } else {
//             // Image is taller than target
//             drawWidth = canvas.width;
//             drawHeight = drawWidth / aspectRatio;
//             offsetY = (drawHeight - canvas.height) / 2;
//         }

//         // Draw image on canvas with cropping
//         ctx.drawImage(img, -offsetX, -offsetY, drawWidth, drawHeight);

//         // Convert canvas to blob
//         const blob = await new Promise<Blob>((resolve) => {
//             canvas.toBlob((blob) => {
//                 if (blob) resolve(blob);
//             }, file.type);
//         });

//         // Create new file from blob
//         const resizedFile = new File([blob], file.name, {
//             type: file.type,
//             lastModified: file.lastModified,
//         });

//         // Clean up
//         URL.revokeObjectURL(imageUrl);

//         // Upload the resized file
//         return uploadToS3(resizedFile);
//     } catch (error) {
//         console.error('Error in uploadImageToS3:', error);
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : 'Unknown error occurred',
//         };
//     }
// }

// export const deleteFile = async (fileKey: string) => {
//     try {
//         // URL encode the key to handle special characters
//         const encodedKey = encodeURIComponent(fileKey);
//         const response = await fetch(`/api/files/${encodedKey}`, {
//             method: 'DELETE',
//         });

//         const result = await response.json();

//         if (result.success) {
//             console.log('File deleted successfully');
//         } else {
//             console.error('Failed to delete file:', result.error);
//         }

//         return result;
//     } catch (error) {
//         console.error('Error in delete request:', error);
//         return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
//     }
// };

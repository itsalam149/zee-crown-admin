import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.3, // 300KB
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error("Image compression error:", error);
        return file; // Fallback to original file if compression fails
    }
}
"use client"

import { useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { useAICaptions } from "react-a11y-auto-caption";

interface OptimizedImageProps {
  src: string;
  image_id?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function OptimizedImage({ src, image_id, width, height, fill, className, style }: OptimizedImageProps) {
    const { generatedAlt, isGenerating } = useAICaptions({ src, lazyGenerate: false });
    const alt = isGenerating ? "Loading caption..." : generatedAlt;

    useEffect(() => {
        if (!image_id || isGenerating || !generatedAlt) return;

        fetch(`/api/image/${image_id}/alt`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ alt: generatedAlt }),
        }).catch((err) => console.error("Failed to save alt:", err));
    }, [image_id, generatedAlt, isGenerating]);

    if (fill) {
        return (
            <CldImage
                src={src}
                alt={alt}
                fill
                className={className}
                style={style}
            />
        );
    }

    return (
        <CldImage
            src={src}
            alt={alt}
            width={width!}
            height={height!}
            className={className}
            style={style}
        />
    );
}

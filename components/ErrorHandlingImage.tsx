'use client';

interface ErrorHandlingImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function ErrorHandlingImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = 'https://placehold.co/600x400/indigo/white?text=Image+Not+Found' 
}: ErrorHandlingImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = fallbackSrc;
      }}
    />
  );
}
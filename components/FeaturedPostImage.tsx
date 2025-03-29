'use client';

interface FeaturedPostImageProps {
  imageUrl: string;
  title: string;
}

export default function FeaturedPostImage({ imageUrl, title }: FeaturedPostImageProps) {
  return (
    <img
      className="h-64 w-full object-cover md:h-full"
      src={imageUrl}
      alt={title}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://placehold.co/600x400/indigo/white?text=Featured+Post";
      }}
    />
  );
}
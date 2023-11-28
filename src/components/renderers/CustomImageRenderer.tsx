"use client";

import imageKitLoader from "@/lib/imagekit/imageLoader";
import Image from "next/image";

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file?.url;

  const params = new URL(src).searchParams;

  const width = params.get("width");
  const height = params.get("height");

  if (width !== null && height !== null) {
    return (
      <Image
        width={Number(width)}
        height={Number(height)}
        alt="image"
        className="!mb-1.5 w-full max-w-full rounded-2xl"
        src={src}
        sizes="(max-width: 768px) 85vw, (max-width: 1280px) 75vw, 60vw"
        loader={imageKitLoader}
      />
    );
  }
  return (
    <div className="relative z-0 min-h-[15rem] w-full">
      <Image
        alt="image"
        className="!mb-1.5 h-auto max-w-full object-contain sm:rounded-2xl"
        src={src}
        sizes="(max-width: 768px) 85vw, (max-width: 1280px) 75vw, 60vw"
        loader={imageKitLoader}
        fill
      />
    </div>
  );
};

export default CustomImageRenderer;

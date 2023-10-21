"use client";

import imageKitLoader from "@/lib/imagekit/imageLoader";
import Image from "next/image";

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file?.url;

  return (
    <div className="relative z-0 min-h-[15rem] w-full">
      {src.includes("imagekit.io") ? (
        <Image
          alt="image"
          className="h-auto max-w-full object-contain sm:rounded-2xl"
          src={src}
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 50vw, 33vw"
          loader={imageKitLoader}
          fill
        />
      ) : (
        <Image
          alt="image"
          className="h-auto max-w-full object-contain sm:rounded-2xl"
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 50vw, 33vw"
          src={src}
          fill
        />
      )}
    </div>
  );
};

export default CustomImageRenderer;

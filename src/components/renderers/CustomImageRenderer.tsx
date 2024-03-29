"use client";

import imageKitLoader from "@/lib/imagekit/imageLoader";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file?.url;

  const params = new URL(src).searchParams;
  const width =
    (data.file?.width as number | undefined) || Number(params.get("width"));
  const height =
    (data.file?.height as number | undefined) || Number(params.get("height"));

  const aspectRatio = useMemo(
    () => Math.max(width / height, 8 / 9),
    [width, height],
  );

  if (width && height) {
    return (
      <Link
        href={src}
        className="not-prose relative z-[1] !mb-1.5 block h-full w-full cursor-pointer overflow-hidden rounded-2xl after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-default/30"
        prefetch={false}
        target="_blank"
      >
        <div
          className="relative w-full overflow-hidden bg-highlight/50"
          style={{ aspectRatio }}
        >
          <Image
            alt="image"
            className="h-full w-full object-cover"
            src={src}
            sizes="(max-width: 768px) 85vw, (max-width: 1280px) 75vw, 60vw"
            loader={imageKitLoader}
            fill
          />
        </div>
        {data.caption ? (
          <div className="flex w-full grow items-center bg-subtle px-3 py-2">
            <p className="not-prose text-sm">{data.caption}</p>
          </div>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={src}
      className="not-prose relative z-[1] !mb-1.5 block h-full w-full cursor-pointer overflow-hidden rounded-2xl after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-default/30"
      prefetch={false}
      target="_blank"
    >
      <div
        className="relative z-0 min-h-[15rem] w-full overflow-hidden bg-highlight/50"
        style={{ aspectRatio }}
      >
        <Image
          alt="image"
          className="h-full w-full object-cover"
          src={src}
          sizes="(max-width: 768px) 85vw, (max-width: 1280px) 75vw, 60vw"
          loader={imageKitLoader}
          fill
        />
      </div>
      {data.caption ? (
        <div className="flex w-full grow items-center bg-subtle px-3 py-2">
          <p className="not-prose text-sm">{data.caption}</p>
        </div>
      ) : null}
    </Link>
  );
};

export default CustomImageRenderer;

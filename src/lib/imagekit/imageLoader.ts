"use client";

import { env } from "@/env.mjs";
/**
 * @see https://docs.imagekit.io/getting-started/quickstart-guides/nextjs
 */

import { ImageLoaderProps } from "next/image";

export default function imageKitLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  if (src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }

  const urlRegex = /\/([^/]+)$/;

  if (src.includes("https://")) {
    const matchResult = src.match(urlRegex);
    if (matchResult && matchResult[1]) {
      src = matchResult[1];
    }
  }

  const paramsString = params.join(",");

  let urlEndpoint = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (urlEndpoint[urlEndpoint.length - 1] === "/")
    urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  return `${urlEndpoint}/tr:${paramsString}/${src}`;
}

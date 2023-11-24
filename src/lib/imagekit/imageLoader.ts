"use client";

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

  let urlEndpoint = "";

  if (src.includes("https://")) {
    const matchResult = src.match(urlRegex);

    if (matchResult) {
      if (matchResult[1]) {
        src = matchResult[1];
      }
      urlEndpoint = matchResult.input?.slice(0, matchResult?.index) ?? "";
    }
  }

  const paramsString = params.join(",");

  if (urlEndpoint[urlEndpoint.length - 1] === "/")
    urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);
  return `${urlEndpoint}/tr:${paramsString}/${src}`;
}

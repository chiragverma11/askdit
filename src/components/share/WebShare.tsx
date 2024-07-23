import React, {
  FC,
  cloneElement,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import { ChangeTypeOfKeys } from "@/types/utilities";
import { useClipboard, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { Icons } from "../Icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogItem,
  DialogTitle,
} from "../ui/Dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerItem,
  DrawerTitle,
} from "../ui/Drawer";
import { Separator } from "../ui/Separator";
import SocialIcon, {
  ShareData,
  SocialIconList,
  SocialIconListKeys,
} from "./icon/SocialIcon";

const defaultSites = Object.keys(SocialIconList) as SocialIconListKeys[];

interface WebShareProps {
  data: ShareData;
  sites?: SocialIconListKeys[];
  onClick?: () => void;
  disableNative?: boolean;
  children: React.ReactNode;
}

export const WebShare = memo((props: WebShareProps) => {
  const [opened, handlers] = useDisclosure();
  const isLg = useMediaQuery("(min-width: 1024px)");

  const shareData = useMemo(
    () => ({
      ...props.data,
      title: props.data.title || "share",
      text: props.data.text || "",
      url:
        props.data.url ||
        (typeof window !== "undefined" && window.location.href) ||
        "",
    }),
    [props.data],
  );

  const handleOnClick = useCallback(async () => {
    if (window.navigator.share && !props.disableNative) {
      try {
        await window.navigator.share(shareData);
        if (props.onClick) {
          props.onClick();
        }
      } catch (e) {
        console.warn(e);
      }
    } else {
      handlers.open();
    }
  }, [shareData, handlers, props]);

  const showNativeShare = useCallback(async () => {
    if (window.navigator.share && props.disableNative) {
      try {
        handlers.close();
        await window.navigator.share(shareData);
      } catch (e) {
        console.warn(e);
      }
    }
  }, [shareData, handlers, props]);

  return (
    <>
      {/* Overrides Children element's `onClick` event */}
      {React.isValidElement(props.children) &&
        React.Children.count(props.children) === 1 &&
        cloneElement(props.children as React.ReactElement, {
          ...(props.children as React.ReactElement)?.props,
          onClick: handleOnClick,
        })}

      {isLg ? (
        <WebShareDialog
          opened={opened}
          data={shareData}
          sites={props.sites || defaultSites}
          disableNative={props.disableNative}
          showNativeShare={showNativeShare}
          {...handlers}
        />
      ) : (
        <WebShareDrawer
          opened={opened}
          data={shareData}
          sites={props.sites || defaultSites}
          disableNative={props.disableNative}
          showNativeShare={showNativeShare}
          {...handlers}
        />
      )}
    </>
  );
});

interface WebShareDrawerProps
  extends ChangeTypeOfKeys<
    Pick<WebShareProps, "disableNative" | "onClick" | "data">,
    "data",
    Required<Pick<WebShareProps, "data">["data"]>
  > {
  sites: Pick<Required<WebShareProps>, "sites">["sites"];
  opened: boolean;
  open: () => void;
  close: () => void;
  showNativeShare: () => void;
}

const WebShareDrawer: FC<WebShareDrawerProps> = ({
  data,
  sites,
  disableNative,
  onClick,
  opened,
  close,
  open,
  showNativeShare,
}) => {
  const [showQr, setShowQr] = useState(false);
  const clipboard = useClipboard();

  function copyLink() {
    clipboard.copy(data.url);
    if (!clipboard.error) {
      toast.info("Link Copied!");
    }
  }

  return (
    <>
      <Drawer
        open={opened}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            open();
          } else {
            setShowQr(false);
            close();
          }
          if (isOpen === true) {
            document.documentElement.style.removeProperty("overflow");
            document.body.style.overflow = "hidden";
          } else {
            document.body.style.removeProperty("overflow");
          }
        }}
      >
        <DrawerContent
          className="text-sm"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DrawerHeader className="pb-1 text-left">
            <DrawerTitle>Share to...</DrawerTitle>
          </DrawerHeader>

          <DrawerItem className="flex flex-col items-start">
            <p className="w-full truncate text-base font-medium">
              {data.title}
            </p>
            <p className="w-full truncate text-sm text-subtle">{data.url}</p>
          </DrawerItem>

          <Separator className="my-1" />
          <DrawerItem className="gap-4 overflow-x-scroll">
            {sites.map((name) => (
              <SocialIcon
                name={name}
                key={name}
                data={data}
                onClick={onClick}
              />
            ))}
          </DrawerItem>

          <Separator className="my-1" />
          <DrawerItem className="gap-2" asChild>
            <DrawerClose onClick={copyLink} asChild>
              <button className="flex flex-col items-center gap-1.5 p-2 text-xs">
                <Icons.link className="h-6 w-6" />
                Copy link
              </button>
            </DrawerClose>
            <button
              className="flex flex-col items-center gap-1.5 p-2 text-xs"
              onClick={() => setShowQr(true)}
            >
              <Icons.qrCode className="relative h-6 w-6" />
              QR code
            </button>
            {disableNative && (
              <button
                className="flex flex-col items-center gap-1.5 p-2 text-xs"
                onClick={showNativeShare}
              >
                <Icons.moreHorizontal className="relative h-6 w-6" />
                More
              </button>
            )}
          </DrawerItem>

          {showQr && (
            <>
              <Separator className="my-1" orientation="horizontal" />
              <QRCode
                url={`https://chart.googleapis.com/chart?cht=qr&chl=${data.url}&chs=540x540`}
                grow="vertical"
                imageClassName="my-3"
              />
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

const WebShareDialog: FC<WebShareDrawerProps> = ({
  data,
  sites,
  disableNative,
  onClick,
  opened,
  close,
  open,
  showNativeShare,
}) => {
  const [showQr, setShowQr] = useState(false);
  const clipboard = useClipboard();

  function copyLink() {
    clipboard.copy(data.url);
    if (!clipboard.error) {
      toast.info("Link Copied!");
    }
  }

  return (
    <Dialog
      open={opened}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          open();
        } else {
          setShowQr(false);
          close();
        }
      }}
    >
      <DialogContent className="flex max-w-[90vw] flex-col rounded-xl bg-emphasis dark:bg-default sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share to...</DialogTitle>
        </DialogHeader>
        <DialogItem className="flex flex-col items-start p-0">
          <p className="w-full truncate text-base font-medium">{data.title}</p>
          <p className="w-full truncate text-sm text-subtle">{data.url}</p>
        </DialogItem>
        <Separator className="my-1" />
        <div className="flex gap-4">
          <div className="shrink-[250] space-y-4">
            <DialogItem className="flex-wrap gap-4 p-0">
              {sites.map((name) => (
                <SocialIcon
                  name={name}
                  key={name}
                  data={data}
                  onClick={onClick}
                />
              ))}
            </DialogItem>
            <Separator className="" />
            <DialogItem className="flex-wrap gap-2 p-0">
              <button
                className="flex flex-col items-center gap-1.5 p-2 text-xs"
                onClick={() => {
                  copyLink();
                  close();
                }}
              >
                <Icons.link className="h-6 w-6" />
                Copy link
              </button>
              <button
                className="flex flex-col items-center gap-1.5 p-2 text-xs"
                onClick={() => setShowQr(true)}
              >
                <Icons.qrCode className="relative h-6 w-6" />
                QR code
              </button>
              {disableNative && (
                <button
                  className="flex flex-col items-center gap-1.5 p-2 text-xs"
                  onClick={showNativeShare}
                >
                  <Icons.moreHorizontal className="relative h-6 w-6" />
                  More
                </button>
              )}
            </DialogItem>
          </div>
          {showQr && (
            <QRCode
              url={data.url}
              grow="horizontal"
              className=""
              imageClassName="rounded-xl w-48 px-5"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const QRCode = ({
  url,
  grow = "vertical",
  className,
  imageClassName,
}: {
  url: any;
  grow?: "horizontal" | "vertical";
  className?: string;
  imageClassName?: string;
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(true);

  const variants = {
    hidden:
      grow === "vertical"
        ? { height: 0, opacity: 0 }
        : { width: 0, opacity: 0 },
    visible:
      grow === "vertical"
        ? { height: "auto", opacity: 1 }
        : { width: "auto", opacity: 1 },
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://qrcode.show/${url}`, {
          method: "GET",
          headers: {
            accept: "image/png",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setImageSrc(imageObjectURL);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [url, imageSrc]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      variants={variants}
      className={cn("overflow-hidden", className)}
      key={url}
    >
      <div
        className={cn(
          "relative mx-auto aspect-square w-full max-w-72 overflow-hidden rounded-3xl border border-default/75",
          loading && "animate-pulse bg-emphasis/60",
          imageClassName,
        )}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            className="object-fill"
            alt="QR"
            fill={true}
            unoptimized
          />
        ) : null}
      </div>
    </motion.div>
  );
};

WebShare.displayName = "WebShare";

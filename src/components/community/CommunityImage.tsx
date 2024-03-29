"use client";

import {
  IMAGEKIT_COMMUNITY_PROFILE_UPLOAD_FOLDER,
  MAX_PROFILE_IMAGE_SIZE_IN_BYTES,
} from "@/lib/config";
import { ImageKitImageUploader } from "@/lib/imagekit/imageUploader";
import { type getCommunity } from "@/lib/prismaQueries";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { FC, useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import CommunityAvatar from "../CommunityAvatar";
import { Icons } from "../Icons";

interface CommunityImageProps extends React.ComponentPropsWithoutRef<"div"> {
  community: NonNullable<Awaited<ReturnType<typeof getCommunity>>>;
  session: Session | null;
}

const CommunityImage: FC<CommunityImageProps> = ({
  community,
  session,
  className,
}) => {
  const [communityImage, setCommunityImage] = useState<string | null>(
    community.image,
  );

  return (
    <div className="relative">
      <CommunityAvatar
        className={cn("h-16 w-16 text-3xl", className)}
        communityName={community.name}
        image={communityImage}
      />
      {session?.user.id === community.creatorId && (
        <ImageUpdater
          communityId={community.id}
          communityName={community.name}
          onUpdate={(updatedImage: string) => setCommunityImage(updatedImage)}
        />
      )}
    </div>
  );
};

interface ImageUpdaterProps {
  communityId: string;
  communityName: string;
  onUpdate: (updatedImage: string) => void;
}

const ImageUpdater: FC<ImageUpdaterProps> = ({
  communityId,
  communityName,
  onUpdate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const { mutate: updateCommunityProfileImage, isLoading } =
    trpc.community.updateProfileImage.useMutation({
      onSuccess: (data) => {
        toast.success("Image updated");
        onUpdate(data.image);
      },
      onError: () => {
        toast.error("Error updating image", {
          description: "Please try again later",
        });
      },
      onSettled: () => {
        setIsUpdating(false);
      },
    });

  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUpdating(true);

      const response = await ImageKitImageUploader({
        file: acceptedFiles[0],
        fileName: `${communityName}_profile`,
        folder: IMAGEKIT_COMMUNITY_PROFILE_UPLOAD_FOLDER,
      });

      if (response.success === 0) {
        setIsUpdating(false);
        return toast.error("Error uploading image", {
          description: "Please try again later",
        });
      }

      if (!response.result?.url) {
        setIsUpdating(false);
        return toast.error("Something went wrong", {
          description: "Please try again later",
        });
      }

      const imageUrl = new URL(response.result?.url);
      imageUrl.searchParams.append("id", response.result.fileId);
      imageUrl.searchParams.append("width", `${response.result.width}`);
      imageUrl.searchParams.append("height", `${response.result.height}`);

      updateCommunityProfileImage({
        communityId: communityId,
        imageUrl: imageUrl.toString(),
      });
    },
    [communityId, communityName, updateCommunityProfileImage],
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    // Handle file too large rejections toast
    if (
      fileRejections.some(
        (rejection) =>
          rejection.errors?.some((error) => error.code === "file-too-large"),
      )
    ) {
      toast.error("File too large!", {
        description: `You can't upload files larger than 512kb`,
      });
    }

    // Handle too many files rejections toast
    if (
      fileRejections.some(
        (rejection) =>
          rejection.errors?.some((error) => error.code === "too-many-files"),
      )
    ) {
      toast.error("Too many files!", {
        description: "You can only select one image",
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: { "image/*": [] },
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_PROFILE_IMAGE_SIZE_IN_BYTES,
    noDrag: true,
    disabled: isUpdating,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button className="absolute -bottom-3 -right-2 rounded-full border bg-highlight/50 p-1.5 backdrop-blur-md duration-300 hover:border-default/50 hover:bg-highlight hover:transition active:scale-95">
        {isUpdating ? (
          <Icons.loader className="h-3.5 w-3.5 animate-spin text-default/75" />
        ) : (
          <Icons.edit className="h-3.5 w-3.5 text-default/75" />
        )}
      </button>
    </div>
  );
};

export default CommunityImage;

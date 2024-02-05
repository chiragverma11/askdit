import { useToast } from "@/hooks/use-toast";
import {
    DROPZONE_MAX_FILES,
    DROPZONE_MAX_FILE_SIZE_IN_BYTES,
    MEDIA_CAPTION_LENGTH,
} from "@/lib/config";
import { cn } from "@/lib/utils";
import { useMediaDropzoneStore } from "@/store/mediaDropzoneStore";
import { Media } from "@/types/utilities";
import Image from "next/image";
import React, { FC, useCallback, useEffect } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import TextareaAutosize from "react-textarea-autosize";
import { Icons } from "../Icons";
import { Button } from "../ui/Button";

interface MediaDropzoneProps extends React.ComponentPropsWithoutRef<"div"> {}

const MediaDropzone: FC<MediaDropzoneProps> = ({ className }) => {
  const files = useMediaDropzoneStore((state) => state.files);
  const addFiles = useMediaDropzoneStore((state) => state.addFiles);

  const preview = useMediaDropzoneStore((state) => state.preview);
  const setPreview = useMediaDropzoneStore((state) => state.setPreview);

  const cleanup = useMediaDropzoneStore((state) => state.cleanup);

  const { toast } = useToast();

  const addAcceptedFilesWithPreview = useCallback(
    (acceptedFiles: File[]) => {
      const acceptedFilesWithPreview = acceptedFiles.map((file) => {
        const media: Media = {
          file,
          preview: URL.createObjectURL(file),
          uploadStatus: "idle",
        };
        return media;
      });

      addFiles(acceptedFilesWithPreview);

      if (!preview) {
        return setPreview(acceptedFilesWithPreview[0]);
      }

      if (acceptedFilesWithPreview.length > 0) {
        return setPreview(
          acceptedFilesWithPreview[acceptedFilesWithPreview.length - 1],
        );
      }
    },
    [addFiles, preview, setPreview],
  );

  const handleFileRejections = useCallback(
    (fileRejections: FileRejection[]) => {
      console.log(fileRejections);

      const canAcceptFiles = DROPZONE_MAX_FILES - files.length;

      // Handle file too large rejections toast
      if (
        fileRejections.some(
          (rejection) =>
            rejection.errors?.some((error) => error.code === "file-too-large"),
        )
      ) {
        toast({
          variant: "destructive",
          title: "File too large!",
          description: "You can't upload files larger than 4MB",
        });
      }

      // Handle too many files rejections toast
      if (
        fileRejections.some(
          (rejection) =>
            rejection.errors?.some((error) => error.code === "too-many-files"),
        )
      ) {
        toast({
          variant: "destructive",
          title: "Too many files!",
          description: "You have hit the limit of 10 images",
        });
      }

      if (canAcceptFiles > 0) {
        const fileRejectionsShouldAccept = fileRejections.filter(
          (fileRejection) =>
            ((fileRejection.errors.length === 1 || 0) &&
              fileRejection.errors[0]?.code === "too-many-files") ||
            undefined,
        );

        if (fileRejectionsShouldAccept.length > 0) {
          const rejectedFiles = fileRejectionsShouldAccept
            .slice(0, canAcceptFiles)
            .map((rejection) => rejection.file);

          addAcceptedFilesWithPreview(rejectedFiles);
        }
      }
    },
    [addAcceptedFilesWithPreview, files, toast],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        return handleFileRejections(fileRejections);
      }

      addAcceptedFilesWithPreview(acceptedFiles);
    },
    [addAcceptedFilesWithPreview, handleFileRejections],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: DROPZONE_MAX_FILES - files.length,
    maxSize: DROPZONE_MAX_FILE_SIZE_IN_BYTES,
    disabled: files.length >= DROPZONE_MAX_FILES,
  });

  useEffect(() => {
    // To revoke preview Object Url when component unmounts
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex w-full max-w-full gap-4 overflow-x-auto pb-3">
        {files.length > 0 && <SelectedMediaList />}
        {files.length < DROPZONE_MAX_FILES && (
          <div
            className={cn(
              "text-secondary-100/75 flex flex-col items-center justify-center gap-4 rounded-xl border-default/40 text-sm transition-colors duration-100 ease-in-out md:text-base",
              isDragActive &&
                "border-default/70 bg-highlight/40 dark:bg-highlight/60",
              files.length === 0
                ? "h-48 w-full border-2 border-dashed"
                : "group/dropzone h-[100px] w-[100px] shrink-0 cursor-pointer rounded-lg border border-dashed",
            )}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {files.length === 0 ? (
              <DropZoneInputContent isDragActive={isDragActive} />
            ) : (
              <Icons.plus className="h-8 w-8 stroke-[3] text-default/40 group-hover/dropzone:text-default" />
            )}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="flex w-full flex-col gap-3 md:flex-row md:justify-evenly">
          <SelectedMediaPreview />
          <SelectedMediaCaptionInput />
        </div>
      )}
    </div>
  );
};

const SelectedMediaList = () => {
  const media = useMediaDropzoneStore((state) => state.files);

  const preview = useMediaDropzoneStore((state) => state.preview);
  const setPreview = useMediaDropzoneStore((state) => state.setPreview);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    file: Media,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setPreview(file);
    }
  };

  return (
    <ul className="flex gap-3 text-xs">
      {media.map((media, index) => {
        const isActive = media.preview === preview?.preview;

        return (
          <li
            key={`${media.file.name}_${media.file.lastModified}_${media.file.size}_${index}`}
            className={cn(
              "group/preview relative h-[100px] w-[100px] overflow-hidden rounded-lg bg-highlight/50",
              isActive && "border-2 border-default bg-transparent p-1.5",
            )}
            tabIndex={0}
            role="button"
            onClick={() => setPreview(media)}
            onKeyDown={(e) => handleKeyDown(e, media)}
          >
            {isActive ? (
              <div className="relative h-full w-full overflow-hidden rounded-md">
                <Image
                  src={media.preview}
                  className="object-cover"
                  alt={`preview_${media.file.name}`}
                  fill
                  unoptimized
                />
                <RemoveFileButton file={media} />
                <MediaUploadStatus file={media} />
              </div>
            ) : (
              <>
                <Image
                  src={media.preview}
                  className="object-cover opacity-50 group-hover/preview:opacity-100"
                  alt={`preview_${media.file.name}`}
                  fill
                  unoptimized
                />
                <RemoveFileButton file={media} />
                <MediaUploadStatus file={media} />
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};

interface RemoveFileButtonProps {
  file: Media;
}

const RemoveFileButton: FC<RemoveFileButtonProps> = ({ file }) => {
  const removeFile = useMediaDropzoneStore((state) => state.removeFile);

  const files = useMediaDropzoneStore((state) => state.files);

  const preview = useMediaDropzoneStore((state) => state.preview);
  const setPreview = useMediaDropzoneStore((state) => state.setPreview);

  const setNextPreview = useCallback(() => {
    const index = files.findIndex((f) => f === file);

    if (files.length === 1) {
      setPreview(null);
    } else if (index === 0) {
      setPreview(files[index + 1]);
    } else {
      setPreview(files[index - 1]);
    }
  }, [file, files, setPreview]);

  const handleRemoveFile = (file: Media) => {
    removeFile(file);

    if (file === preview) {
      setNextPreview();
    }
  };

  return (
    <Button
      className="absolute right-1 top-1 aspect-square h-5 w-5 items-center justify-center rounded-full bg-black p-0 text-white hover:bg-black lg:hidden lg:group-hover/preview:flex"
      size="icon"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleRemoveFile(file);
      }}
    >
      <Icons.close className="h-4 w-4 stroke-[4.25]" />
    </Button>
  );
};

interface MediaUploadStatusProps {
  file: Media;
}

const MediaUploadStatus: FC<MediaUploadStatusProps> = ({ file }) => {
  if (file.uploadStatus === "idle") {
    return null;
  }

  return (
    <span className="pointer-events-none absolute bottom-1 right-1 aspect-square text-default">
      {file.uploadStatus === "uploading" && (
        <Icons.loader className="h-4 w-4 animate-spin" />
      )}
      {file.uploadStatus === "uploaded" && (
        <Icons.check className="h-4 w-4 stroke-[3] text-green-500" />
      )}
      {file.uploadStatus === "failed" && (
        <Icons.alertCircle className="h-4 w-4 stroke-[3] text-destructive" />
      )}
    </span>
  );
};

const SelectedMediaPreview = () => {
  const media = useMediaDropzoneStore((state) => state.preview);

  if (!media) return null;

  return (
    <div className="relative aspect-square h-full w-full overflow-hidden rounded-lg bg-highlight/60">
      <Image
        src={media.preview}
        className="object-contain"
        alt={`preview_${media.file.name}`}
        fill
        unoptimized
      />
    </div>
  );
};

const SelectedMediaCaptionInput = () => {
  const media = useMediaDropzoneStore((state) => state.preview);
  const setPreviewCaption = useMediaDropzoneStore(
    (state) => state.setPreviewCaption,
  );

  if (!media) return null;

  return (
    <div className="relative h-fit w-full p-1">
      <TextareaAutosize
        className={cn(
          "flex h-10 w-full rounded-md border border-default/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "w-full resize-none overflow-hidden bg-transparent pr-12 focus:outline-none lg:pr-10",
        )}
        value={media.caption || ""}
        onChange={(e) => setPreviewCaption(e.target.value)}
        placeholder="Add a caption..."
        maxLength={MEDIA_CAPTION_LENGTH}
        autoComplete="off"
      />
      <span className="pointer-events-none absolute bottom-3 right-3 text-xxs font-semibold text-subtle">{`${
        media.caption?.length || 0
      }/${MEDIA_CAPTION_LENGTH}`}</span>
    </div>
  );
};

interface DropZoneInputContentProps {
  isDragActive: boolean;
}

const DropZoneInputContent: FC<DropZoneInputContentProps> = ({
  isDragActive,
}) => {
  return (
    <>
      {isDragActive ? (
        <Icons.dropFiles className="h-10 w-10 rounded-full border border-default/20 bg-emphasis px-2 shadow-md outline outline-offset-[3px] outline-zinc-500/30 ring-4 ring-subtle/80" />
      ) : (
        <Icons.uploadCloud className="h-10 w-10 rounded-full border border-default/20 bg-emphasis px-2 shadow-md outline outline-offset-[3px] outline-zinc-500/30 ring-4 ring-subtle/80" />
      )}
      <div className="flex min-h-10 flex-col items-center gap-y-2 md:flex-row md:gap-1">
        {isDragActive ? (
          <p>Drop files here to Upload</p>
        ) : (
          <>
            <p>Drag and drop your files here or</p>
            <Button
              type="button"
              role="upload"
              variant={"outline"}
              className="ml-1.5 h-auto w-fit rounded-full border border-default/40 px-2.5 py-1.5 font-semibold text-blue-500 [font-size:inherit] hover:text-blue-600 dark:hover:text-blue-400"
            >
              Upload
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default MediaDropzone;

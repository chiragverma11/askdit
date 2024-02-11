import { toast } from "@/hooks/use-toast";
import {
  IMAGEKIT_MEDIA_POST_UPLOAD_FOLDER,
  STORAGE_LIMIT_PER_USER,
} from "@/lib/config";
import { ImageKitImageUploader } from "@/lib/imagekit/imageUploader";
import { trpc } from "@/lib/trpc";
import { addResolutionToImageUrl } from "@/lib/utils";
import { MediaPostValidator } from "@/lib/validators/post";
import { useMediaDropzoneStore } from "@/store/mediaDropzoneStore";
import { Media } from "@/types/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostType } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { FC, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/Button";
import MediaDropzone from "./MediaDropzone";
import SubmitPostTitle from "./SubmitPostTitle";

interface CreateMediaPostProps {
  communityId: string | undefined;
  className?: string;
}

type FormData = z.infer<typeof MediaPostValidator>;

type FormDataKeysContentExcluded = Exclude<keyof FormData, "content">;

const CreateMediaPost: FC<CreateMediaPostProps> = ({
  communityId,
  className,
}) => {
  const [uploading, setUploading] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const disabled = useMemo(() => (communityId ? false : true), [communityId]);

  const postType: PostType = "MEDIA";

  const { register, watch, trigger, setValue, getValues } = useForm<FormData>({
    resolver: zodResolver(MediaPostValidator),
    defaultValues: {
      title: "",
      content: { type: "IMAGE", images: [{ id: "", url: "" }] },
      communityId,
      type: postType,
    },
  });

  const files = useMediaDropzoneStore((state) => state.files);
  const setFileUploadStatus = useMediaDropzoneStore(
    (state) => state.setFileUploadStatus,
  );

  const { ref: titleRef, ...rest } = register("title");

  const { data: userWithStorage } = trpc.post.getUserStorageUsed.useQuery(
    undefined,
    { refetchOnWindowFocus: false },
  );

  const { mutate: createPost, isLoading } =
    trpc.post.createCommunityPost.useMutation({
      onSuccess(data) {
        const newPathname = pathname
          .split("/")
          .slice(0, -1)
          .concat(["post", data.postId])
          .join("/");
        toast({
          description: "Your post has been created successfully.",
        });
        router.push(newPathname);
      },
    });

  const uploadFiles = async () => {
    if (!userWithStorage) {
      return false;
    }

    const totalFilesSize = files.reduce((acc, file) => acc + file.file.size, 0);

    if (
      userWithStorage.storageUsed + totalFilesSize >=
      STORAGE_LIMIT_PER_USER
    ) {
      return false;
    }

    const uploadPromises = files.map(async (media) => {
      if (
        media.uploadStatus === "uploaded" &&
        media.url &&
        media.id &&
        media.size
      ) {
        return;
      }

      setUploading(true);
      setFileUploadStatus({ file: media, status: "uploading" });

      try {
        const res = await ImageKitImageUploader({
          file: media.file,
          folder: IMAGEKIT_MEDIA_POST_UPLOAD_FOLDER,
        });

        if (res.success === 0) {
          setFileUploadStatus({ file: media, status: "failed" });
          throw new Error("Upload failed");
        }

        setFileUploadStatus({
          file: media,
          status: "uploaded",
          id: res.result?.fileId as string,
          url: addResolutionToImageUrl(
            res.result?.url,
            res.result?.width,
            res.result?.height,
          ),
          size: res.result?.size || media.file.size,
        });
        return res;
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Please try again later",
        });
        setFileUploadStatus({ file: media, status: "failed" });
        return false;
      }
    });

    await Promise.all(uploadPromises);

    setUploading(false);

    return true;
  };

  const onSubmit = async (data: FormData) => {
    createPost(data);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /**
     * data validation
     */

    const fieldNames: FormDataKeysContentExcluded[] = Object.keys(
      getValues(),
    ).filter((key) => key !== "content") as FormDataKeysContentExcluded[];

    // Trigger validation for all fields except 'content'
    const isFormValidExceptContent = await trigger(fieldNames);

    if (!isFormValidExceptContent) {
      toast({
        description: "Fill out required fields",
      });
      return;
    }

    /**
     * uploading files/media
     */

    const filesUploaded = await uploadFiles();

    if (!filesUploaded) {
      setUploading(false);
      toast({
        title: "Failed to post",
        description: "Please try again",
      });
      return;
    }

    /**
     * updating state
     */

    // Retrieve a fresh reference to the files from the Zustand store
    const updatedFiles = useMediaDropzoneStore.getState().files;

    const uploadedFiles = updatedFiles.filter(
      (file): file is Media & { id: string; url: string; size: string } =>
        file.url !== undefined &&
        file.id !== undefined &&
        file.size !== undefined,
    );

    const updatedContent: FormData["content"] = {
      type: "IMAGE",
      images: uploadedFiles.map((file) => ({
        id: file.id,
        url: file.url,
        caption: file.caption,
        size: file.size,
      })),
    };

    setValue("content", updatedContent);

    const storageUsed = uploadedFiles.reduce(
      (acc, file) => acc + (file.size || file.file.size),
      0,
    );

    setValue("storageUsed", storageUsed);

    /**
     * submitting form
     */

    const result = await trigger();

    if (result) {
      const formData = getValues();
      onSubmit(formData);
    }
  };

  return (
    <div className={className}>
      <form id="communityMediaPostForm" onSubmit={handleFormSubmit}>
        <div className="w-full">
          <SubmitPostTitle
            titleLength={watch("title").length}
            submitButtonRef={submitButtonRef}
            titleValidationRef={titleRef}
            useFormRegisterRest={rest}
            disabled={disabled}
          />
          <div className="min-h-[200px] py-3">
            <div className="relative">
              <MediaDropzone />
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <p className="hidden text-sm text-gray-500 md:inline">
              Files will be uploaded when you click on post.
            </p>
            <Button
              type="submit"
              form="communityMediaPostForm"
              className="self-end px-6 py-1 font-semibold"
              isLoading={isLoading || uploading}
              ref={submitButtonRef}
              disabled={disabled}
            >
              {uploading ? "Uploading" : "Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateMediaPost;

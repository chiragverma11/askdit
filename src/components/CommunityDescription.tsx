"use client";

import { useToast } from "@/hooks/use-toast";
import { COMMUNITY_DESCRIPTION_LENGTH } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { DescriptionValidator } from "@/lib/validators/community";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClickOutside } from "@mantine/hooks";
import { Pencil } from "lucide-react";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { Button } from "./ui/Button";

interface CommunityDescriptionProps {
  initialDescription: string | null;
  communityId: string;
  isAuthor: boolean;
}

const CommunityDescription: FC<CommunityDescriptionProps> = ({
  initialDescription,
  communityId,
  isAuthor,
}) => {
  const [addingDescription, setAddingDescription] = useState(false);

  const [description, setDescription] = useState(initialDescription);

  const closeAddingDescription = () => {
    setAddingDescription(false);
  };

  const ref = useClickOutside(closeAddingDescription);

  if (addingDescription) {
    return (
      <AddCommunityDescription
        description={description}
        communityId={communityId}
        close={closeAddingDescription}
        setDescription={setDescription}
        ref={ref}
      />
    );
  }

  return (
    <>
      {description !== null ? (
        <div
          className={cn(
            "inline w-full whitespace-pre-wrap break-words",
            isAuthor &&
              "cursor-pointer gap-2 rounded-md border border-transparent transition-[padding] hover:border-default hover:p-1",
          )}
          onClick={() => {
            isAuthor && setAddingDescription(true);
          }}
        >
          {description}
          {isAuthor ? <Pencil className="mx-1 inline h-4 w-4" /> : null}
        </div>
      ) : isAuthor ? (
        <div
          className="w-full cursor-pointer rounded-md border border-default/25 bg-subtle px-2 py-2 text-xs font-semibold hover:border-default"
          onClick={() => setAddingDescription(true)}
        >
          Add Description
        </div>
      ) : null}
    </>
  );
};

interface AddDescriptionProps {
  description: string | null;
  communityId: string;
  setDescription: React.Dispatch<React.SetStateAction<string | null>>;
  close: () => void;
}

type AddDescriptionRequestType = z.infer<typeof DescriptionValidator>;

const AddCommunityDescription = React.forwardRef<
  HTMLDivElement,
  AddDescriptionProps
>(({ description, communityId, setDescription, close }, ref) => {
  const { toast } = useToast();

  const { handleSubmit, register, watch } = useForm<AddDescriptionRequestType>({
    resolver: zodResolver(DescriptionValidator),
    defaultValues: {
      description: description ?? "",
      communityId: communityId,
    },
  });

  const { ref: descriptionRef, ...rest } = register("description");

  const { mutate: addDescription, isLoading } =
    trpc.community.addDescription.useMutation({
      onSuccess: ({ description }) => {
        setDescription(description);
        close();
        toast({ description: "Description updated successfully" });
      },
    });

  const onSubmit = (data: AddDescriptionRequestType) => {
    addDescription(data);
  };

  return (
    <div
      className="w-full break-all rounded-md border border-default bg-subtle p-2 text-sm"
      ref={ref}
    >
      <form id="addDescriptionForm" onSubmit={handleSubmit(onSubmit)}>
        <TextareaAutosize
          placeholder="Tell us about your community"
          className="max-h-28 w-full resize-none overflow-hidden overflow-y-auto break-normal bg-transparent focus:outline-none lg:max-h-none lg:min-h-[32px]"
          minRows={1}
          autoFocus={true}
          ref={(e) => descriptionRef(e)}
          {...rest}
        />
        <div className="flex items-center justify-between text-xs">
          <span className="text-subtle">
            {watch("description").length}/{COMMUNITY_DESCRIPTION_LENGTH}
          </span>
          <div className="flex items-center justify-between gap-2">
            <Button
              className="h-auto rounded bg-transparent p-0.5 text-xs font-semibold text-destructive hover:bg-transparent"
              size={"xs"}
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              className="h-auto rounded bg-transparent p-0.5 text-xs font-semibold text-default hover:bg-transparent"
              form="addDescriptionForm"
              size={"xs"}
              isLoading={isLoading}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
});

AddCommunityDescription.displayName = "AddCommunityDescription";

export default CommunityDescription;

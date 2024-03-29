"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { useFeedViewStore } from "@/store/feedViewStore";
import { FeedViewType } from "@/types/utilities";
import { FC } from "react";
import { Icons } from "./Icons";

interface FeedViewTypeSelectorProps
  extends React.ComponentPropsWithoutRef<"button"> {}

const FeedViewTypeSelector: FC<FeedViewTypeSelectorProps> = ({
  className,
  ...props
}) => {
  const feedViewType = useFeedViewStore((state) => state.feedViewType);
  const setFeedViewType = useFeedViewStore((state) => state.setFeedViewType);

  return (
    <Select
      value={feedViewType}
      onValueChange={(value: FeedViewType) => {
        setFeedViewType(value);
      }}
    >
      <SelectTrigger className={cn("w-fit", className)} {...props}>
        {feedViewType === "card" ? (
          <Icons.card className="h-5 w-5 text-subtle" />
        ) : (
          <Icons.compact className="h-5 w-5 text-subtle" />
        )}
      </SelectTrigger>
      <SelectContent
        className="border-default/40 font-medium text-subtle"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <SelectItem
          className="group/item flex items-center gap-2 data-[state=checked]:font-bold data-[state=checked]:text-brand-text"
          value="card"
          textValue="Card"
          indicatorSide="right"
        >
          <Icons.card className="h-5 w-5 group-data-[state=checked]/item:scale-105" />
          Card
        </SelectItem>
        <SelectItem
          className="group/item flex items-center gap-2 data-[state=checked]:font-bold data-[state=checked]:text-brand-text"
          value="compact"
          textValue="Compact"
          indicatorSide="right"
        >
          <Icons.compact className="h-5 w-5 group-data-[state=checked]/item:scale-105" />
          Compact
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FeedViewTypeSelector;

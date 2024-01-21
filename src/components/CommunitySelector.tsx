"use client";

import { Subreddit } from "@prisma/client";
import { LineWobble } from "@uiball/loaders";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { trpc } from "@/lib/trpc";
import { useDebouncedValue } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { z } from "zod";
import CommunityAvatar from "./CommunityAvatar";
import { Icons } from "./Icons";

interface CommunitySelectorProps {
  community?: Subreddit;
}

const searchCommunitiesQuerySchema = z.string().min(1);

const CommunitySelector: React.FC<CommunitySelectorProps> = ({ community }) => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(community?.name || "");
  const [search, setSearch] = React.useState(community?.name || "");

  const searchParams = useSearchParams();

  const { data: session } = useSession();

  const [debouncedQuery] = useDebouncedValue(search, 300);

  const router = useRouter();

  const { data: yourCommunities, isLoading: isLoadingYourCommunities } =
    trpc.community.yourCommunities.useQuery();

  const {
    data: otherCommunities,
    refetch: searchOtherCommunities,
    isFetching: isFetchingOtherCommunities,
  } = trpc.community.searchCommunities.useQuery(
    { query: debouncedQuery, userId: session?.user.id },
    { enabled: false, retry: false, retryOnMount: false },
  );

  const selectedCommunity =
    community?.name === selected
      ? community
      : yourCommunities?.find(
          ({ Subreddit: community }) => community.name === selected,
        )?.Subreddit ||
        otherCommunities?.find((community) => community.name === selected);

  React.useEffect(() => {
    setTimeout(async () => {
      const { success } =
        await searchCommunitiesQuerySchema.safeParseAsync(debouncedQuery);
      if (success) {
        searchOtherCommunities();
      }
    }, 100);
  }, [debouncedQuery, searchOtherCommunities]);

  const redirectToCommunity = ({
    communityName,
  }: {
    communityName: string;
  }) => {
    router.push(`/r/${communityName}/submit?${searchParams.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between bg-emphasis text-default hover:bg-emphasis active:scale-100"
        >
          {selected ? (
            <SelectedCommunity
              image={selectedCommunity?.image || ""}
              name={selectedCommunity?.name || ""}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-full border border-dashed border-default"></span>
              Choose a community
            </div>
          )}
          <Icons.chevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command className="border border-default/25 bg-subtle">
          <CommandInput
            placeholder="Choose a community"
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No communities found.</CommandEmpty>

          <CommandList className="max-h-[300px]">
            <CommandGroup heading="Your Communities">
              {isLoadingYourCommunities && (
                <div className="flex h-24 w-full items-center justify-center">
                  {/* <Icons.loader className="h-5 w-5 animate-spin text-subtle" /> */}
                  <LineWobble color="gray" lineWeight={4} />
                </div>
              )}
              {yourCommunities?.map(({ Subreddit: community }) => (
                <CommandItem
                  key={community.name}
                  value={community.name}
                  onSelect={(currentValue) => {
                    setSelected(currentValue === selected ? "" : currentValue);
                    setOpen(false);
                    redirectToCommunity({ communityName: community.name });
                  }}
                  className="flex items-center gap-2"
                >
                  <CommunityAvatar
                    communityName={community.name}
                    image={community.image}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">r/{community.name}</span>
                    <span className="text-xs text-subtle">
                      {community._count.subscribers} members
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {otherCommunities ? (
              <CommandGroup heading="Other Communities">
                {otherCommunities?.map((community) => (
                  <CommandItem
                    key={community.name}
                    value={community.name}
                    onSelect={(currentValue) => {
                      setSelected(
                        currentValue === selected ? "" : currentValue,
                      );
                      setOpen(false);
                      redirectToCommunity({ communityName: community.name });
                    }}
                    className="flex items-center gap-2"
                  >
                    <CommunityAvatar
                      communityName={community.name}
                      image={community.image}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm">r/{community.name}</span>
                      <span className="text-xs text-subtle">
                        {community._count.subscribers} members
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {isFetchingOtherCommunities && (
              <div className="flex w-full justify-center py-2">
                <LineWobble color="gray" lineWeight={4} />
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface SelectedCommunityProps {
  name: string;
  image: string;
}
const SelectedCommunity: React.FC<SelectedCommunityProps> = ({
  name,
  image,
}) => {
  return (
    <div className="flex items-center gap-2">
      <CommunityAvatar
        communityName={name}
        image={image}
        className="h-6 w-6 text-base"
      />
      {`r/${name}`}
    </div>
  );
};

export default CommunitySelector;

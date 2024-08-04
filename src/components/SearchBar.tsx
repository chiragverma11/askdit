"use client";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  SearchFormValidator,
  SearchRequestType,
} from "@/lib/validators/search";
import { type RecentSearch, useRecentSearchStore } from "@/store/recentSearchStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedValue, useHotkeys, useMediaQuery } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CommunityAvatar from "./CommunityAvatar";
import { Icons } from "./Icons";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";

interface SearchBarProps extends React.ComponentPropsWithoutRef<"div"> { }

const SearchBar: FC<SearchBarProps> = (props) => {
  const isLg = useMediaQuery("(min-width: 1024px)");

  if (isLg) {
    return <SearchBarPopover {...props} />;
  }

  return <SearchBarDialog {...props} />;
};

interface SearchBarDialogProps extends React.ComponentPropsWithoutRef<"div"> { }

const SearchBarPopover: FC<SearchBarDialogProps> = ({
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>();
  const popoverTriggerRef = useRef<HTMLDivElement>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  useHotkeys([["/", () => searchInputRef.current?.focus()]]);

  const router = useRouter();

  const recentSearches = useRecentSearchStore((state) => state.recentSearches);
  const addRecentSearch = useRecentSearchStore(
    (state) => state.addRecentSearch,
  );
  const clearRecentSearches = useRecentSearchStore(
    (state) => state.clearRecentSearches,
  );

  const { register, watch, trigger, setValue, handleSubmit } =
    useForm<SearchRequestType>({
      resolver: zodResolver(SearchFormValidator),
      defaultValues: {
        query: pathname.startsWith("/search")
          ? searchParams.get("q") || ""
          : "",
      },
    });

  const { ref, ...rest } = register("query");

  const [query] = useDebouncedValue(watch("query"), 300);

  const {
    data: searchSuggestions,
    refetch: refetchSearchSuggestions,
    isFetching: isFetchingSearchSuggestions,
  } = trpc.search.searchSuggestions.useQuery(
    { query: query, userId: session?.user.id },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      trpc: { abortOnUnmount: true },
    },
  );

  const unselectActiveElement = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleTriggerBlur: React.FocusEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    if (
      popoverContentRef.current &&
      !popoverContentRef.current.contains(event.relatedTarget as Node) &&
      !popoverTriggerRef.current?.contains(event.relatedTarget as Node)
    ) {
      setOpen(false);
    }
  };

  const handleContentBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (
      popoverContentRef.current &&
      !popoverContentRef.current.contains(event.relatedTarget as Node) &&
      !popoverTriggerRef.current?.contains(event.relatedTarget as Node)
    ) {
      setOpen(false);
    }
  };

  const onSubmit = (data: SearchRequestType) => {
    addRecentSearch({ type: "text", searchQuery: data.query });
    unselectActiveElement();

    router.push(`/search?q=${data.query}`);
  };

  const handleNonTextRedirects: typeof addRecentSearch = (data) => {
    if (data.type === "text") {
      return;
    }

    addRecentSearch(data);
    unselectActiveElement();

    const redirectUrl = `/${data.displayInfo.name}`;

    router.push(redirectUrl);
  };

  const handleRecentSearch = (recentSearch: RecentSearch) => {
    const result = SearchFormValidator.safeParse({
      query: recentSearch.searchQuery,
    });
    if (!result.success) {
      return;
    }

    if (recentSearch.type === "community" || recentSearch.type === "user") {
      return handleNonTextRedirects({
        type: recentSearch.type,
        searchQuery: recentSearch.searchQuery,
        displayInfo: recentSearch.displayInfo,
      });
    }

    setValue("query", recentSearch.searchQuery);
    onSubmit({ query: recentSearch.searchQuery });
  };

  useEffect(() => {
    if (
      searchInputRef.current &&
      document.activeElement === searchInputRef.current
    ) {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (open && searchSuggestions?.query !== query) {
      setTimeout(async () => {
        const { success } = await SearchFormValidator.safeParseAsync({
          query: query,
        });
        if (success) {
          refetchSearchSuggestions();
        }
      }, 100);
    }
  }, [open, query, searchSuggestions?.query, refetchSearchSuggestions]);

  return (
    <Popover open={open}>
      <PopoverTrigger
        onClick={() => searchInputRef.current?.focus()}
        onFocus={() => {
          if (open) {
            return;
          }
          searchInputRef.current?.focus();
          setOpen(true);
        }}
        onBlur={handleTriggerBlur}
        asChild
      >
        <div className="w-full lg:w-4/6">
          <div
            className={cn(
              "group/search relative hidden w-full items-center gap-2 rounded-lg border border-default/25 bg-emphasis/80 px-4 text-sm text-default/75 backdrop-blur-xl focus-within:border-default/90 focus-within:bg-subtle focus-within:transition hover:border-default/90 lg:inline-flex",
              className,
            )}
            ref={popoverTriggerRef}
            {...props}
          >
            <Icons.search className="h-5 w-5 text-subtle" />
            <form
              id="searchForm"
              className="flex w-full items-center gap-1"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                className="w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
                placeholder="Search"
                spellCheck="false"
                ref={(e) => {
                  ref(e);
                  searchInputRef.current = e;
                }}
                autoComplete="off"
                {...rest}
              />
              {query.length > 0 ? (
                <button
                  aria-label="Remove search bar text"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("query", "");
                    searchInputRef.current?.focus();
                  }}
                >
                  <Icons.closeCircle className="hidden h-5 w-5 cursor-pointer group-focus-within/search:inline-block group-hover/search:inline-block" />
                </button>
              ) : null}
            </form>
          </div>
          <Icons.search
            className={cn("inline-block h-6 w-6 lg:hidden", className)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="z-[51] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-b-xl rounded-t-lg border border-default/40 p-0"
        ref={popoverContentRef}
        onBlur={handleContentBlur}
      >
        <Command className="bg-subtle">
          <CommandList className="max-h-[80vh] text-sm ">
            {query.length === 0 && recentSearches.length > 0 && (
              <CommandGroup>
                <div
                  aria-hidden={true}
                  role="group-heading"
                  className="flex items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <p>Recent</p>
                  <button
                    aria-label="Clear recent searches"
                    onClick={() => clearRecentSearches()}
                    className="flex items-center"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search) => (
                  <CommandItem
                    key={search.id}
                    onSelect={() => {
                      handleRecentSearch(search);
                    }}
                    className="cursor-pointer px-4 py-2 font-medium text-default/75 aria-selected:bg-emphasis aria-selected:text-default/90"
                  >
                    <RecentSearch search={search} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchSuggestions ? (
              <>
                {searchSuggestions.communitySuggestions.length > 0 && (
                  <CommandGroup heading="Communities">
                    {searchSuggestions.communitySuggestions.map((community) => (
                      <CommandItem
                        key={community.id}
                        value={community.name}
                        onSelect={() => {
                          handleNonTextRedirects({
                            type: "community",
                            searchQuery: query,
                            displayInfo: {
                              iconUrl: community.image,
                              name: `r/${community.name}`,
                            },
                          });
                        }}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 font-medium text-default/75 aria-selected:bg-emphasis aria-selected:text-default/90"
                      >
                        <CommunityAvatar
                          communityName={community.name}
                          image={community.image}
                          className="h-7 w-7"
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
                )}
                {searchSuggestions.userSuggestions.length > 0 && (
                  <CommandGroup heading="People">
                    {searchSuggestions.userSuggestions.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.username || ""}
                        onSelect={() => {
                          handleNonTextRedirects({
                            type: "user",
                            searchQuery: query,
                            displayInfo: {
                              iconUrl: user.image,
                              name: `u/${user.username}`,
                            },
                          });
                        }}
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 font-medium text-default/75 aria-selected:bg-emphasis aria-selected:text-default/90"
                      >
                        <UserAvatar
                          user={{ name: user.name, image: user.image }}
                          className="h-7 w-7"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm">u/{user.username}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            ) : null}

            <CommandSeparator />
            {query.length > 0 ? (
              <CommandItem className="p-0 aria-selected:bg-emphasis">
                <SubmitSearchQuery query={query} />
              </CommandItem>
            ) : null}

            {query.length === 0 && (
              <p className="p-4 text-subtle">Search something...</p>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface SearchBarDialogProps extends React.ComponentPropsWithoutRef<"div"> { }

const SearchBarDialog: FC<SearchBarDialogProps> = ({ className, ...props }) => {
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>();
  const popoverTriggerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  useHotkeys([["/", () => searchInputRef.current?.focus()]]);

  const router = useRouter();

  const recentSearches = useRecentSearchStore((state) => state.recentSearches);
  const addRecentSearch = useRecentSearchStore(
    (state) => state.addRecentSearch,
  );
  const clearRecentSearches = useRecentSearchStore(
    (state) => state.clearRecentSearches,
  );

  const { register, watch, trigger, setValue, handleSubmit } =
    useForm<SearchRequestType>({
      resolver: zodResolver(SearchFormValidator),
      defaultValues: {
        query: pathname.startsWith("/search")
          ? searchParams.get("q") || ""
          : "",
      },
    });

  const { ref, ...rest } = register("query");

  const [query] = useDebouncedValue(watch("query"), 300);

  const {
    data: searchSuggestions,
    refetch: refetchSearchSuggestions,
    isFetching: isFetchingSearchSuggestions,
  } = trpc.search.searchSuggestions.useQuery(
    { query: query, userId: session?.user.id },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      trpc: { abortOnUnmount: true },
    },
  );

  const onSubmit = (data: SearchRequestType) => {
    addRecentSearch({ type: "text", searchQuery: data.query });
    setOpen(false);

    router.push(`/search?q=${data.query}`);
  };

  const handleNonTextRedirects: typeof addRecentSearch = (data) => {
    if (data.type === "text") {
      return;
    }

    addRecentSearch(data);

    setOpen(false);

    const redirectUrl = `/${data.displayInfo.name}`;

    router.push(redirectUrl);
  };

  const handleRecentSearch = (recentSearch: RecentSearch) => {
    const result = SearchFormValidator.safeParse({
      query: recentSearch.searchQuery,
    });
    if (!result.success) {
      return;
    }

    if (recentSearch.type === "community" || recentSearch.type === "user") {
      return handleNonTextRedirects({
        type: recentSearch.type,
        searchQuery: recentSearch.searchQuery,
        displayInfo: recentSearch.displayInfo,
      });
    }

    setValue("query", recentSearch.searchQuery);
    onSubmit({ query: recentSearch.searchQuery });
  };

  React.useEffect(() => {
    if (open && searchSuggestions?.query !== query) {
      setTimeout(async () => {
        const { success } = await SearchFormValidator.safeParseAsync({
          query: query,
        });
        if (success) {
          refetchSearchSuggestions();
        }
      }, 100);
    }
  }, [open, query, searchSuggestions?.query, refetchSearchSuggestions]);

  return (
    <Dialog open={open}>
      <DialogTrigger
        onClick={() => {
          setOpen(true);
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 300);
        }}
        asChild
      >
        <div className="lg:w-4/6">
          <div
            className={cn(
              "group/search relative hidden w-full items-center gap-2 rounded-lg border border-default/25 bg-emphasis/80 px-4 text-sm text-default/75 backdrop-blur-xl focus-within:border-default/90 focus-within:bg-subtle focus-within:transition hover:border-default/90 lg:inline-flex",
              className,
            )}
            {...props}
          >
            <Icons.search className="h-5 w-5 text-subtle" />
            <form className="flex w-full items-center gap-1">
              <input
                type="text"
                className="w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
                placeholder="Search"
                spellCheck="false"
                autoComplete="off"
                {...rest}
              />
              {query.length > 0 ? (
                <button
                  aria-label="Remove search bar text"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setValue("query", "");
                    searchInputRef.current?.focus();
                  }}
                >
                  <Icons.closeCircle className="hidden h-5 w-5 cursor-pointer group-focus-within/search:inline-block group-hover/search:inline-block" />
                </button>
              ) : null}
            </form>
          </div>
          <Button
            className={cn("hover:bg-transparent lg:hidden", className)}
            variant={"ghost"}
            size={"icon"}
          >
            <Icons.search className="h-6 w-6" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="h-full border-0 bg-black max-w-full"
        closeButton={false}
      >
        <Command className="absolute inset-0 bg-default/80">
          <div className="flex items-center gap-3 border-b border-default/25 bg-subtle/50 px-4 py-2 text-sm text-default/75">
            <Button
              className="h-fit w-fit hover:bg-transparent"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <Icons.backArrow className="h-6 w-6" />
            </Button>
            <div
              className={cn(
                "group/search relative inline-flex w-full items-center gap-2 rounded-lg px-4 focus-within:bg-emphasis focus-within:transition",
                className,
              )}
              ref={popoverTriggerRef}
              {...props}
            >
              <Icons.search className="h-6 w-6 text-subtle" />
              <form
                id="searchForm"
                className="flex w-full items-center gap-1"
                onSubmit={handleSubmit(onSubmit)}
              >
                <input
                  type="text"
                  className="text- w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
                  placeholder="Search"
                  spellCheck="false"
                  ref={(e) => {
                    ref(e);
                    searchInputRef.current = e;
                  }}
                  autoComplete="off"
                  {...rest}
                />
                {query.length > 0 ? (
                  <button
                    aria-label="Remove search bar text"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("query", "");
                      searchInputRef.current?.focus();
                    }}
                  >
                    <Icons.closeCircle className="hidden h-5 w-5 cursor-pointer group-focus-within/search:inline-block group-hover/search:inline-block" />
                  </button>
                ) : null}
              </form>
            </div>
          </div>

          <CommandList className="max-h-full rounded-b-2xl bg-subtle/50 text-sm shadow-lg">
            {query.length === 0 && recentSearches.length > 0 && (
              <CommandGroup>
                <div
                  aria-hidden={true}
                  role="group-heading"
                  className="flex items-center justify-between px-2 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  <p>Recent</p>
                  <button
                    aria-label="Clear recent searches"
                    onClick={() => clearRecentSearches()}
                    className="flex items-center"
                  >
                    Clear
                  </button>
                </div>
                {recentSearches.map((search) => (
                  <CommandItem
                    key={search.id}
                    onSelect={() => {
                      handleRecentSearch(search);
                    }}
                    className="cursor-pointer px-4 py-3 font-medium text-default/75 aria-selected:bg-emphasis aria-selected:text-default/90"
                  >
                    <RecentSearch search={search} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchSuggestions ? (
              <>
                {searchSuggestions.communitySuggestions.length > 0 && (
                  <CommandGroup heading="Communities">
                    {searchSuggestions.communitySuggestions.map((community) => (
                      <CommandItem
                        key={community.id}
                        value={community.name}
                        onSelect={() => {
                          handleNonTextRedirects({
                            type: "community",
                            searchQuery: query,
                            displayInfo: {
                              iconUrl: community.image,
                              name: `r/${community.name}`,
                            },
                          });
                        }}
                        className="flex cursor-pointer items-center gap-2 px-4 py-3 font-medium text-default/75 aria-selected:bg-emphasis aria-selected:text-default/90"
                      >
                        <CommunityAvatar
                          communityName={community.name}
                          image={community.image}
                          className="h-7 w-7"
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
                )}
                {searchSuggestions.userSuggestions.length > 0 && (
                  <CommandGroup heading="People">
                    {searchSuggestions.userSuggestions.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.username || ""}
                        onSelect={() => {
                          handleNonTextRedirects({
                            type: "user",
                            searchQuery: query,
                            displayInfo: {
                              iconUrl: user.image,
                              name: `u/${user.username}`,
                            },
                          });
                        }}
                        className="flex cursor-pointer items-center gap-2 px-4 py-3 font-medium text-default/75 aria-selected:bg-emphasis aria-selected:text-default/90"
                      >
                        <UserAvatar
                          user={{ name: user.name, image: user.image }}
                          className="h-7 w-7"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm">u/{user.username}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            ) : null}

            <CommandSeparator />
            {query.length > 0 ? (
              <CommandItem className="p-0 aria-selected:bg-emphasis">
                <SubmitSearchQuery query={query} />
              </CommandItem>
            ) : null}

            {query.length === 0 && (
              <p className="p-4 text-subtle">Search something...</p>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

interface RecentSearchProps {
  search: RecentSearch;
}

const RecentSearch: FC<RecentSearchProps> = ({ search }) => {
  if (search.type === "community") {
    return (
      <div className="flex w-full items-center gap-2">
        <CommunityAvatar
          communityName={search.displayInfo.name.slice(2)}
          image={search.displayInfo.iconUrl}
          className="h-7 w-7"
        />
        <p className="w-full truncate">{search.displayInfo.name}</p>
        <RemoveRecentSearch searchId={search.id} />
      </div>
    );
  } else if (search.type === "user") {
    return (
      <div className="flex w-full items-center gap-2">
        <UserAvatar
          user={{
            name: search.displayInfo.name.slice(2),
            image: search.displayInfo.iconUrl,
          }}
          className="h-7 w-7"
        />
        <p className="w-full truncate">{search.displayInfo.name}</p>
        <RemoveRecentSearch searchId={search.id} />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2">
      <Icons.search className="block aspect-square h-7 w-7 rounded-full" />
      <p className="w-full truncate">{search.searchQuery}</p>
      <RemoveRecentSearch searchId={search.id} />
    </div>
  );
};

interface RemoveRecentSearchProps {
  searchId: string;
}

const RemoveRecentSearch: FC<RemoveRecentSearchProps> = ({ searchId }) => {
  const removeRecentSearch = useRecentSearchStore(
    (state) => state.removeRecentSearch,
  );

  return (
    <Icons.closeCircle
      className="h-5 w-5"
      onClick={(e) => {
        e.stopPropagation();
        removeRecentSearch({ id: searchId });
      }}
    />
  );
};

interface SubmitSearchQueryProps {
  query: string;
}

const SubmitSearchQuery: FC<SubmitSearchQueryProps> = ({ query }) => {
  return (
    <button
      className="flex w-full items-center gap-2 p-4 text-default/75"
      form="searchForm"
      type="submit"
    >
      <Icons.search className="h-5 w-5" /> Search for &ldquo;{query}&rdquo;
    </button>
  );
};

export default SearchBar;

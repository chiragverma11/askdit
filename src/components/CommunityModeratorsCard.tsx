import Link from "next/link";
import { FC, Suspense } from "react";

interface CommunityModeratorsCardProps {
  moderator: string | null;
}

const CommunityModeratorsCard: FC<CommunityModeratorsCardProps> = ({
  moderator,
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-default/40 bg-emphasis px-4 py-4">
      <div className="flex flex-col gap-4">
        <p className="font-bold text-subtle">Moderators</p>
        <div className="flex h-auto w-full flex-col gap-2 text-sm">
          <Suspense
            fallback={<div className="w-full bg-highlight text-sm"></div>}
          >
            <Link
              href={`/u/${moderator}`}
              className="text-sky-600"
            >{`/u/${moderator}`}</Link>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CommunityModeratorsCard;

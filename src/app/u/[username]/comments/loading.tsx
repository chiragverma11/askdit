import { UserCommentSkeleton } from "@/components/user/UserComment";

export default function Loading() {
  return (
    <ul className="space-y-1 pb-16 md:space-y-2 lg:pb-0">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index}>
          <UserCommentSkeleton />
        </li>
      ))}
    </ul>
  );
}

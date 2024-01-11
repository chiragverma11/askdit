import PostSkeleton from "@/components/PostSkeleton";

export default function Loading() {
  return (
    <ul className="space-y-1 pb-16 sm:space-y-2 md:space-y-3 lg:pb-0">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index}>
          <PostSkeleton />
        </li>
      ))}
    </ul>
  );
}

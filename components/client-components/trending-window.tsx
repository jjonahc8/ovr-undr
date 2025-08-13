"use client";

import { useRouter } from "next/navigation";
import NavigateWrapper from "./navigate";

export default function TrendingWindow({
  trendingTweets,
}: {
  trendingTweets?: any[] | null;
}) {
  const router = useRouter();

  const handleRedirect = (route: string) => {
    router.push(`/${route}`);
  };

  return (
    <div
      className="flex flex-col rounded-xl border-gray-600 border-[0.5px]"
      onClick={() => {
        handleRedirect(`protected`);
      }}
    >
      <div className="flex flex-row px-4 pt-4 pb-2">
        <h1 className="font-bold text-2xl">Trending posts</h1>
      </div>
      {trendingTweets?.map((t) => (
        <div
          key={t.id}
          className="hover:bg-white/10 transition duration-200 px-4 py-2 last:rounded-b-xl last:pb-4"
        >
          <NavigateWrapper to={`/post/${t.id}`} stopPropagation={true}>
            <div className="flex flex-col">
              <div className="text-md">{t.text}</div>
              <div className="text-sm text-gray-500">{t.author}</div>
              <div className="text-xs text-gray-500">{t.like_count} like</div>
            </div>
          </NavigateWrapper>
        </div>
      ))}
    </div>
  );
}

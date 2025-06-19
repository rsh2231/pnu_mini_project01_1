"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFetchUser } from "@/hooks/useFetchUser";

interface Post {
  dashId: number;
  title: string;
  createdAt: string;
}

export default function MyPostsPage() {
  const { user, loading } = useFetchUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      console.log("user!!!!", user);
      if (!user?.username) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_API}/api/posts?writer=${user.username}`
        );
        const result = await res.json();

        const postList = result.content?.dashResponseDto?.dashboards ?? [];

        console.log("result:", result);
        console.log("posts:", result.content?.dashResponseDto?.dashboards);
        setPosts(postList);
      } catch (err) {
        console.error("내 게시글 가져오기 실패:", err);
      }
    };

    fetchMyPosts();
  }, [user]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700 font-bold">로딩중... ⏳</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700 font-bold">
          로그인후 이용 가능합니다.
        </p>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl text-gray-700 font-bold mb-6">내 나눔 게시글</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.dashId}
            className="p-4 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition"
          >
            <Link href={`/mypage/posts/${post.dashId}`}>
              <div className="flex justify-between">
                <span className="font-semibold text-lg">{post.title}</span>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

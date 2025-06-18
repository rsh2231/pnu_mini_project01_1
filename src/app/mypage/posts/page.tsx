"use client";

import Link from "next/link";

const dummyPosts = [
  { id: 1, title: "책장 나눔합니다", date: "2025-06-18" },
  { id: 2, title: "의자 필요하신 분", date: "2025-06-17" },
];

export default function MyPostsPage() {
  return (
    <div>
      <h1 className="text-2xl text-gray-700 font-bold mb-6">내 나눔 게시글</h1>
      <ul className="space-y-4">
        {dummyPosts.map((post) => (
          <li
            key={post.id}
            className="p-4 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-50 transition"
          >
            <Link href={`/mypage/posts/${post.id}`}>
              <div className="flex justify-between">
                <span className="font-semibold text-lg">{post.title}</span>
                <span className="text-gray-500 text-sm">{post.date}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

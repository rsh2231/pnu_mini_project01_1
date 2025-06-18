"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button01 from "../etc/Button01";

// 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  writer: string;
  createDate: string;
}

// 디바운스 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// 상수
const POSTS_PER_PAGE = 10;

const BoardList = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [selectedWriter, setSelectedWriter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const router = useRouter();
  const springurl = process.env.NEXT_PUBLIC_SPRING_API;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // 게시글 불러오기
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("size", POSTS_PER_PAGE.toString());
      params.append("method", sortOption);
      params.append("q", searchTerm);
      params.append("writer", selectedWriter)

      const url = `${springurl}/api/posts?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("게시글 데이터를 불러오지 못했습니다.");

      const data = await res.json();
      const dashboards = data.content.dashResponseDto?.dashboards ?? [];

      const mappedPosts: Post[] = dashboards.map((item: any) => ({
        id: item.dashId,
        title: item.title,
        content: item.content,
        writer: item.nickname,
        createDate: item.createdAt,
      }));

      setPosts(mappedPosts);
      setTotalPosts(
        data.content.dashResponseDto?.totalElements || mappedPosts.length
      );
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
      setPosts([]);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  }, [springurl, currentPage, sortOption, searchTerm]);

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedWriter, sortOption,searchTerm, selectedWriter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleWriteClick = () => router.push("/dashboard/write");
  const handlePostClick = (id: number) => router.push(`/dashboard/${id}`);
  const uniqueWriters = Array.from(new Set(posts.map((p) => p.writer)));

return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10 text-slate-200">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          나눔게시판
        </h2>
        <Button01 caption="글쓰기" bg_color="blue" onClick={handleWriteClick} />
      </div>

      {/* 검색 / 필터 */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center bg-slate-900 p-4 rounded-xl shadow-inner border border-slate-700">
        <input
          type="text"
          placeholder="제목 또는 내용 검색"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-grow px-4 py-3 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 bg-slate-800 text-slate-200 placeholder-slate-400 shadow-sm"
        />
        <select
          value={selectedWriter}
          onChange={(e) => setSelectedWriter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-200"
        >
          <option value={""}>전체 작성자</option>
          {uniqueWriters.map((writer) => (
            <option key={writer} value={writer}>
              {writer}
            </option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-slate-700 rounded-lg bg-slate-800 text-slate-200"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="title">제목순</option>
          <option value="nickname">작성자순</option>
        </select>
      </div>

      {/* 게시글 목록 */}
      {error ? (
        <p className="text-center py-10 text-red-500">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-center py-10 text-slate-400">❌ 검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="cursor-pointer bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg transition-transform duration-300"
            >
              <h3 className="text-lg sm:text-xl font-bold text-white hover:underline underline-offset-4">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                ✍️ {post.writer} | 🗓 {new Date(post.createDate).toLocaleString()}
              </p>
              <div
                className="mt-3 text-slate-300 line-clamp-3 text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 sm:px-4 py-2 rounded-full font-semibold border transition duration-200 text-sm sm:text-base ${
                currentPage === i + 1
                  ? "bg-sky-600 text-white border-sky-600 shadow"
                  : "bg-slate-700 text-slate-300 border-slate-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardList;
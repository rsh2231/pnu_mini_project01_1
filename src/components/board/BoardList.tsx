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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const POSTS_PER_PAGE = 10;

interface BoardListProps {
  fixedWriter?: string; // 마이페이지에서 고정된 작성자 필터용 prop
}

const BoardList = ({ fixedWriter }: BoardListProps) => {
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

  // fixedWriter가 있으면 selectedWriter 고정
  useEffect(() => {
    if (fixedWriter) {
      setSelectedWriter(fixedWriter);
    }
  }, [fixedWriter]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("size", POSTS_PER_PAGE.toString());
      params.append("method", sortOption);
      params.append("q", debouncedSearchTerm);
      params.append("writer", selectedWriter);

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

      const filteredPosts = fixedWriter
        ? mappedPosts.filter((p) => p.writer === fixedWriter)
        : mappedPosts;

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
  }, [springurl, currentPage, sortOption, debouncedSearchTerm, selectedWriter, fixedWriter]);

  // 검색어, 필터, 정렬 바뀌면 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedWriter, sortOption]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleWriteClick = () => router.push("/dashboard/write");
  const handlePostClick = (id: number) => router.push(`/dashboard/${id}`);

  // 전체 작성자 목록 (전체 글 중에서만 추출) 
  // fixedWriter 있을 때는 필요 없으므로 빈 배열로 처리
  const uniqueWriters = fixedWriter
    ? []
    : Array.from(new Set(posts.map((p) => p.writer)));

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
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center bg-slate-900/80 backdrop-blur-sm p-5 rounded-2xl shadow-md border border-slate-700">
        <input
          type="text"
          placeholder="🔍 제목 또는 내용 검색"
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!!fixedWriter}
          value={searchTerm}
          className={`w-full sm:flex-grow px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-inner transition-all ${fixedWriter ? "opacity-50 cursor-not-allowed" : ""
            }`}
        />

        {/* 작성자 필터는 fixedWriter가 없을 때만 표시 */}
        {!fixedWriter && (
          <select
            value={selectedWriter}
            onChange={(e) => setSelectedWriter(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-sky-500"
          >
            <option value="">전체 작성자</option>
            {uniqueWriters.map((writer) => (
              <option key={writer} value={writer}>
                {writer}
              </option>
            ))}
          </select>
        )}

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-sky-500"
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
              className="group cursor-pointer bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border border-slate-700 p-6 rounded-2xl shadow transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-sky-600/40 hover:scale-[1.01]"
            >
              <h3 className="text-xl font-semibold text-white mb-1 group-hover:underline underline-offset-4">
                {post.title}
              </h3>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                ✍️ {post.writer}
                <span className="text-slate-600">•</span>
                🗓 {new Date(post.createDate).toLocaleString()}
              </p>
              <div
                className="mt-3 text-slate-300 line-clamp-3 text-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border font-semibold transition-all duration-200 text-sm ${currentPage === i + 1
                  ? "bg-sky-600 text-white border-sky-600 shadow-md"
                  : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
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

"use client";

import { useAtom } from "jotai";
import { isLoginAtom } from "@/atoms/IsLoginAtom";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

import Button01 from "@/components/etc/Button01";
import CommentTree from "@/components/comments/CommentTree";
import CommentForm from "@/components/comments/CommentForm";
import { CommentDto } from "@/type/commentDto";
import { dashBoard } from "@/type/dashborad";

export default function PostDetail() {
  const [loginState] = useAtom(isLoginAtom);
  const currentUser = loginState.username || null;

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const springurl = process.env.NEXT_PUBLIC_SPRING_API;

  const [board, setBoard] = useState<dashBoard | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [refresh, setRefresh] = useState<number>(Date.now());

  useEffect(() => {
    if (!id) return;

    const fetchBoard = async () => {
      try {
        const res = await fetch(`${springurl}/api/post/${id}`);
        const data = await res.json();
        console.log("게시글 응답:", data);

        const ds = data.content.dashboard;
        const mappedData: dashBoard = {
          id: ds.dashId,
          title: ds.title,
          content: ds.content,
          writer: ds.nickname,
          createDate: ds.createdAt,
        };

        setBoard(mappedData);
      } catch (error) {
        console.error("에러:", error);
        setBoard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  // 댓글 불러오기
  const fetchComments = async () => {
    try {
      const res = await fetch(`${springurl}/api/comment/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: {
            comment: {
              dashId: Number(id),
            },
          },
        }),
      });
      const data = await res.json();
      console.log("댓글 서버 응답:", data.content.comments);
      setComments(data.content.comments || []);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id, refresh]);

  const handleDelete = async () => {
    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`${springurl}/api/post/delete?dashId=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { dashboard: { dashId: Number(id) } },
        }),
      });
      if (!res.ok) throw new Error("삭제 실패");

      toast.info("게시글이 삭제되었습니다.");
      router.push("/dashboard");
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const cleanContent = DOMPurify.sanitize(board?.content || "");

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 min-h-screen bg-slate-900 rounded-lg shadow-md text-slate-200 space-y-10">
      {/* 상단 제목 및 버튼 */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-700 pb-4 mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          게시글 상세
        </h1>
        <div className="flex flex-row justify-center items-center flex-wrap gap-2">
          <Button01
            caption="목록으로"
            bg_color="blue"
            onClick={() => router.push("/dashboard")}
          />
          <Button01
            caption="수정"
            bg_color="cyan"
            onClick={() => router.push(`/dashboard/edit/${id}`)}
          />
          <Button01
            caption={deleting ? "삭제 중..." : "삭제"}
            bg_color="orange"
            onClick={handleDelete}
          />
        </div>
      </div>

      {/* 본문 영역 */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-7 w-2/3 bg-slate-700 rounded" />
          <div className="h-4 w-1/3 bg-slate-600 rounded" />
          <div className="h-64 bg-slate-800 rounded" />
        </div>
      ) : board ? (
        <>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3">
            {board.title}
          </h2>

          <div className="text-xs sm:text-sm text-slate-400 mb-6 flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
            <span>작성자: {board.writer}</span>
            <span>작성일: {new Date(board.createDate).toLocaleString()}</span>
          </div>

          <div
            className="bg-slate-800 p-4 sm:p-6 rounded-md text-slate-200 leading-7 whitespace-pre-wrap shadow-inner"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </>
      ) : (
        <p className="text-red-500">게시글을 불러올 수 없습니다.</p>
      )}

      {/* 댓글 */}
      {!loading && board && (
        <div className="mt-10">
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 text-white">
            댓글
          </h3>
          <div className="bg-slate-800 p-3 sm:p-4 rounded-md shadow-inner border border-slate-700">
            <CommentForm
              dashId={board.id}
              parentId={null}
              onCommentPosted={() => setRefresh(Date.now())}
            />
            <div className="mt-6 border-t pt-4 border-slate-700">
              <CommentTree
                comments={comments}
                onRefresh={() => setRefresh(Date.now())}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { CommentDto } from "@/type/commentDto";
import CommentForm from "./CommentForm";
import { useCommentSubmit } from "@/hooks/useCommentSubmit";

interface Props {
  comment: CommentDto;
  onRefresh: () => void;
  currentUser: string | null; // 로그인한 사용자 이름 (username)
}

export default function CommentItem({ comment, onRefresh, currentUser }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { deleteComment } = useCommentSubmit();

  const isDeleted = comment.enabled === false;
  const hasChildren = Array.isArray(comment.children) && comment.children.length > 0;

  // 작성자 본인만 삭제 가능
  const canDelete = currentUser === comment.username;

  const handleDelete = async () => {
    const confirmed = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    const success = await deleteComment(comment.comment_id);
    if (success) {
      onRefresh(); // ✅ 새로고침
    }
  };

  return (
    <div className="ml-4 mt-4 border-l-2 border-slate-700 pl-4">
      <div className="bg-slate-800 p-3 rounded-md shadow-sm">
        <div className="font-bold text-slate-200">{comment.nickname}</div>
        <div className="text-sm text-slate-300 whitespace-pre-wrap">{comment.content}</div>
        <div className="text-xs text-slate-400 mb-1">
          {new Date(comment.created_at).toLocaleString()}
        </div>

        {/* 삭제된 댓글이면 버튼 숨김 */}
        {!isDeleted && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-sky-500 hover:underline"
            >
              답글
            </button>

            {hasChildren && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-xs text-slate-400 hover:underline"
              >
                {collapsed
                  ? `▼ ${comment.children!.length}개의 답글`
                  : "▲ 답글 접기"}
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                className="text-xs text-red-400 hover:underline"
              >
                삭제
              </button>
            )}
          </div>
        )}
      </div>

      {showReplyForm && (
        <CommentForm
          dashId={comment.dashId}
          parentId={comment.comment_id}
          onCommentPosted={() => {
            onRefresh();
            setShowReplyForm(false);
          }}
        />
      )}

      {!collapsed && hasChildren && (
        <div className="mt-2 space-y-2">
          {comment.children!.map((child) => (
            <CommentItem
              key={child.comment_id}
              comment={child}
              onRefresh={onRefresh}
              currentUser={currentUser} // 자식 댓글에도 현재 사용자 전달
            />
          ))}
        </div>
      )}
    </div>
  );
}

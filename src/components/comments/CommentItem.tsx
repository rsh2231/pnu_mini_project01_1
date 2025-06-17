import { useState } from "react";
import { CommentDto } from "@/type/commentDto";
import CommentForm from "./CommentForm";

interface Props {
  comment: CommentDto;
  onRefresh: () => void;
}

export default function CommentItem({ comment, onRefresh }: Props) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const hasChildren = Array.isArray(comment.children) && comment.children.length > 0;

  return (
    <div className="ml-4 mt-4 border-l-2 border-slate-700 pl-4">
      <div className="bg-slate-800 p-3 rounded-md shadow-sm">
        <div className="font-bold text-slate-200">{comment.nickname}</div>
        <div className="text-sm text-slate-300 whitespace-pre-wrap">{comment.content}</div>
        <div className="text-xs text-slate-400 mb-1">
          {new Date(comment.created_at).toLocaleString()}
        </div>

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
        </div>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

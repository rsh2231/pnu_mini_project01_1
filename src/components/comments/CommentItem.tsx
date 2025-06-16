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
    <div className="ml-4 mt-4 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
        <div className="font-bold text-gray-900 dark:text-gray-100">
          {comment.nickname}
        </div>
        <div className="text-sm text-gray-800 dark:text-gray-300">
          {comment.content}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {new Date(comment.created_at).toLocaleString()}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            답글
          </button>

          {hasChildren && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
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

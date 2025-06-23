import { CommentDto } from "@/type/commentDto";
import buildCommentTree from "@/utils/buildCommentTree";
import CommentItem from "./CommentItem";

interface Props {
  comments: CommentDto[];
  onRefresh: () => void;
  currentUser: string | null;
}

export default function CommentTree({ comments, onRefresh, currentUser }: Props) {
  const tree = buildCommentTree(comments);

  return (
    <div className="space-y-4">
      {tree.map((comment) => (
        <div
          key={comment.comment_id}
          className="p-4 bg-slate-800 rounded-md border border-slate-700 text-slate-200"
        >
          <CommentItem comment={comment} onRefresh={onRefresh} currentUser={currentUser} />
        </div>
      ))}
    </div>
  );
}

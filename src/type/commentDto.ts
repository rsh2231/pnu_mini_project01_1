export interface CommentDto {
  comment_id: number;
  content: string;
  nickname: string;
  username: string;       
  dashId: number;
  parent_id: number | null;
  depth: number;
  created_at: string;
  enabled: boolean;
  children?: CommentDto[];
}
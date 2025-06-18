interface PostDetail {
  dashId: number;
  title: string;
  content: string;
  createdAt: string;
  nickname: string;
}

export default async function MyPostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SPRING_API}/api/post/${params.id}`,
    { cache: "no-store", credentials: "include" }
  );
  const result = await res.json();
  const post: PostDetail = result.content?.dashboard;

  if (!post) return <div>게시글을 불러올 수 없습니다.</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        작성자: {post.nickname} | 작성일:{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
    </div>
  );
}

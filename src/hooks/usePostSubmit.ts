import { useRouter } from "next/navigation";
import { User } from "@/type/user";
import {toast} from "react-toastify";

interface PostPayload {
  title: string;
  content: string;
  user: User;
}

export function usePostSubmit() {
  const router = useRouter();
  const springurl = process.env.NEXT_PUBLIC_SPRING_API;

  const submitPost = async ({ title, content, user }: PostPayload) => {
    const payload = {
      caller: "next",
      receiver: "spring",
      status: 200,
      method: "POST",
      URL: "/api/posts",
      message: "게시글 업로드",
      content: {
        dashboard: {
          title,
          content,
          username: user.username,
          nickname: user.nickname,
        },
      },
    };

    try {
      const response = await fetch(`${springurl}/api/post/insert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("게시글 등록 실패");

      toast.info("게시글이 등록되었습니다!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.info("게시글 등록에 실패했습니다.");
    }
  };

  return { submitPost };
}

import { useEffect, useState } from "react";
import { User } from "@/type/user";

export function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 토큰을 상태가 아닌 매 렌더링마다 읽기 (세션 스토리지는 클라이언트 전용)
  const token = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SPRING_API}/loged-in/user`, {
          credentials: "include",
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          throw new Error("유저 정보 요청 실패");
        }

        const data = await res.json();
        
        const member:User =  {
          "username":data.username,
          "nickname":data.nickname
        }
        console.log(member)
        if (!member) throw new Error("유저 정보 없음");
        setUser(member);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]); // 토큰이 바뀔 때마다 실행됨

  return { user, loading };
}

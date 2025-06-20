import { useEffect, useState, useCallback } from "react";
import { User } from "@/type/user";

export function useFetchUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

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
      const member: User = {
        username: data.username,
        nickname: data.nickname,
        address: data.address,
      };

      setUser(member);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, refetch: fetchUser };
}

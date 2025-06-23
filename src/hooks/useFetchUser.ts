import { useEffect, useState, useCallback } from "react";
import { User } from "@/type/user";
import axios from "axios";

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
			const res = await axios.get("/api/login/userinfo", {
				headers: { Authorization: token },
				withCredentials: true,
				}
			);

			if (res.status!==200) {
				throw new Error("유저 정보 요청 실패");
			}

			const data = res.data
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

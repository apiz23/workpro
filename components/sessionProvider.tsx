"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter();

	useEffect(() => {
		const isAuthenticated = sessionStorage.getItem("logged-in") === "true";

		if (!isAuthenticated) {
			router.push("/auth");
		}
	}, [router]);

	return <>{children}</>;
};

export default AuthProvider;

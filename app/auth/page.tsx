"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		if (!username || !password) {
			return;
		}

		try {
			const { data, error } = await supabase
				.from("users")
				.select("username, password, type")
				.eq("username", username)
				.single();

			console.log(data);
			if (error) {
				console.error("Error fetching user data:", error);
				return;
			}

			if (data && data.username === username && data.password === password) {
				sessionStorage.setItem("logged-in", "true");
				sessionStorage.setItem("user-id", data.username);
				if (data.type === "worker") {
					router.push("/dashboard");
				} else {
					router.push("/mainPanel");
				}
			} else {
				console.error("Invalid username");
			}
		} catch (error) {
			console.error("Unexpected login error:", error);
		}
	};

	return (
		<main className="min-h-screen max-w-3xl mx-auto items-center justify-between pt-48 md:pt-52 p-16 md:p-24">
			<Card>
				<CardHeader>
					<CardTitle className="text-4xl">Welcome to Work Pro</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="py-2.5">
						<Input
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>
					<div className="py-2.5">
						<Input
							placeholder="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Link href="/dashboard">
						<Button
							variant="default"
							className="inline-block mx-auto rounded border bg-whtie border-indigo-600 px-10 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
							onClick={handleSubmit}
						>
							Submit
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
}

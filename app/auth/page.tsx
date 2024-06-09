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
import { toast } from "sonner";

export default function Login() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [userType, setUserType] = useState("");

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
			if (error) {
				toast.error("Error fetching user data");
				return;
			}

			if (data && data.username === username && data.password === password) {
				sessionStorage.setItem("user-id", data.username);
				if (userType === "worker") {
					sessionStorage.setItem("logged-in", "true");
					router.push("/dashboard");
				} else if (userType === "admin" && data.type !== "worker") {
					sessionStorage.setItem("logged-in", "true");
					router.push("/mainPanel");
				}
			} else {
				toast.error("Invalid username");
			}
		} catch (error) {
			toast.error("Unexpected login error");
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
					<fieldset className="grid grid-cols-2 gap-4">
						<div>
							<label className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
								<div>
									<p className="text-gray-700">Worker</p>
								</div>

								<input
									type="radio"
									name="userType"
									value="worker"
									id="worker"
									className="size-5 border-gray-300 text-blue-500"
									onChange={(e) => setUserType(e.target.value)}
								/>
							</label>
						</div>
						<div>
							<label className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
								<div>
									<p className="text-gray-700">Admin</p>
								</div>
								<input
									type="radio"
									value="admin"
									name="userType"
									id="admin"
									className="size-5 border-gray-300 text-blue-500"
									onChange={(e) => setUserType(e.target.value)}
								/>
							</label>
						</div>
					</fieldset>
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

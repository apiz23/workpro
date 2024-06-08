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
import Link from "next/link";

export default function Login() {
	return (
		<main className="min-h-screen max-w-3xl mx-auto items-center justify-between pt-48 md:pt-52 p-16 md:p-24">
			<Card>
				<CardHeader>
					<CardTitle className="text-4xl">Welcome to Work Pro</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="py-2.5">
						<Input placeholder="Username" />
					</div>
					<div className="py-2.5">
						<Input placeholder="Password" />
					</div>
				</CardContent>
				<CardFooter>
					<Link href="/dashboard">
						<Button
							variant="default"
							className="inline-block mx-auto rounded border bg-whtie border-indigo-600 px-10 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
						>
							Submit
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</main>
	);
}

"use client";

import Link from "next/link";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navigation() {
	const router = useRouter();

	const navItems = [
		{ name: "Home", href: "/dashboard" },
		{ name: "Attendance", href: "/attendance" },
	];

	const handleExit = () => {
		sessionStorage.clear();
		router.push("/auth");
	};

	return (
		<>
			<nav className="fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-5 py-3 bg-sky-200 z-50 rounded-2xl">
				<ul className="flex justify-around">
					{navItems.map((item, index) => (
						<li key={index}>
							<Link href={`${item.href}`} className="text-black hover:text-blue-500">
								{item.name}
							</Link>
						</li>
					))}
					<DropdownMenu>
						<DropdownMenuTrigger>Leave</DropdownMenuTrigger>
						<DropdownMenuContent>
							<Link href={"/leave/holiday"}>
								<DropdownMenuItem>Holiday</DropdownMenuItem>
							</Link>
							<Link href={"/leave/medical"}>
								<DropdownMenuItem>Medical</DropdownMenuItem>
							</Link>
							<Link href={"/leave/emergency"}>
								<DropdownMenuItem>Emergency</DropdownMenuItem>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>
					<LogOut className="h-6 w-6 hover:cursor-pointer" onClick={handleExit} />
				</ul>
			</nav>
		</>
	);
}

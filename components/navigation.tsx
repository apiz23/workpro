"use client";

import Link from "next/link";
import React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
	const navItems = [
		{ name: "Home", href: "/dashboard" },
		{ name: "Attendance", href: "/attendance" },
	];
	return (
		<>
			<nav className="fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-5 py-3 bg-neutral-200 z-50 rounded-2xl">
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
							{/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
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
				</ul>
			</nav>
		</>
	);
}

"use client";

import Login from "@/app/auth/page";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Page() {
	const [auth, setAuth] = useState(true);

	if (auth) {
		return (
			<div className="mx-auto px-4 md:pt-32 lg:flex lg:items-center">
				<div className="mx-auto max-w-xl text-center">
					<h1 className="scroll-m-20 flex my-5 justify-center text-5xl font-extrabold tracking-wide">
						<Dot className="h-14 w-14 text-orange-600" />
						<p className="text-white">APTIV</p>
						<Dot className="h-14 w-14 text-orange-600" />
					</h1>
					<h1 className="text-4xl font-extrabold sm:text-5xl text-white mb-10">
						Welcome to{" "}
						<strong className="font-extrabold text-blue-900">WORK PRO</strong>
					</h1>

					<p className="mt-4 sm:text-xl/relaxed text-sky-50">
						Our platform streamlines leave applications and tracks attendance
						seamlessly, ensuring efficient workforce management
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<Button className="block w-full rounded bg-blue-200 px-12 py-3 text-sm font-medium text-black shadow hover:bg-sky-500 hover:text-white focus:outline-none focus:ring active:bg-blue-500 sm:w-auto">
							Get Started
						</Button>

						<Button className="block w-full rounded px-12 py-3 text-sm font-medium text-blue-600 shadow hover:text-blue-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto">
							Learn More
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return redirect("/auth");
}

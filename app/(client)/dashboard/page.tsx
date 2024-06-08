"use client";

import Login from "@/app/auth/page";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Page() {
	const [auth, setAuth] = useState(true);

	if (auth) {
		return (
			<div className="mx-auto px-4 py-32 lg:flex lg:items-center">
				<div className="mx-auto max-w-xl text-center">
					<h1 className="text-3xl font-extrabold sm:text-5xl">
						Welcome to Work Pro
					</h1>

					<p className="mt-4 sm:text-xl/relaxed">
						Our platform streamlines leave applications and tracks attendance
						seamlessly, ensuring efficient workforce management
					</p>
				</div>
			</div>
		);
	}

	return redirect("/auth");
}

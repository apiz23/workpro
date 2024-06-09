"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

export default function Page() {
	const [time, setTime] = useState("");
	const [selectedTab, setSelectedTab] = useState("clockIn");

	const handleSubmit = async () => {
		const type = selectedTab === "clockIn" ? "Clock In" : "Clock Out";
		const userId = sessionStorage.getItem("user-id");

		if (!time) {
			toast.error("Please enter a time");
			return;
		}

		try {
			const { data, error } = await supabase
				.from("attendance")
				.insert([{ user_id: userId, type: type, time: time }])
				.select();

			if (error) {
				toast.error("Error inserting data");
			} else {
				toast.success("Success Inserted data");
			}
		} catch (error) {
			toast.error("Unexpected error");
		}
	};

	return (
		<div>
			<h2 className="scroll-m-20 border-b pb-2 md:text-5xl text-3xl font-semibold tracking-tight first:mt-0">
				Emergency Leaving
			</h2>
			<div className="my-10">
				<div className="flex justify-between px-5">
					<button
						className={`${
							selectedTab === "clockIn"
								? "bg-indigo-600 text-white"
								: "bg-white text-indigo-600"
						} py-2 px-4 rounded-lg border border-r-0 border-gray-300`}
						onClick={() => setSelectedTab("clockIn")}
					>
						Clock In
					</button>
					<button
						className={`${
							selectedTab === "clockOut"
								? "bg-indigo-600 text-white"
								: "bg-white text-indigo-600"
						} py-2 px-4 rounded-lg border border-l-0 border-gray-300`}
						onClick={() => setSelectedTab("clockOut")}
					>
						Clock Out
					</button>
				</div>
				<Card className="border-none shadow-none">
					<CardContent className="py-8">
						<div className="mb-5 grid grid-cols-1">
							<Input placeholder="Time" onChange={(e) => setTime(e.target.value)} />
						</div>
					</CardContent>
					<CardFooter className="flex justify-end">
						<Button
							className="inline-block bg-white hover:bg-slate-400 rounded border border-current px-8 text-sm font-medium text-indigo-600 hover:text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-indigo-500"
							onClick={handleSubmit}
						>
							Submit
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

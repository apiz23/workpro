"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/datePicker";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

export default function Page() {
	const [selectedDate, setSelectedDate] = useState(null);
	const [time, setTime] = useState("");
	const [reasons, setReasons] = useState("");

	const handleDateSelect = (range: any) => {
		setSelectedDate(range);
	};

	const handleSubmit = async () => {
		if (!selectedDate || !reasons) {
			return;
		}
		try {
			const userId = sessionStorage.getItem("user-id");

			const { data, error } = await supabase.from("emergency_leaves").insert([
				{
					user_id: userId,
					date_leave: selectedDate,
					time_left: time,
					reason: reasons,
				},
			]);
			toast.success("Inserted Request");
			if (error) {
				toast.error("Error inserting data");
				return;
			}
			setSelectedDate(null);
			setTime("");
			setReasons("");
		} catch (error) {
			toast.error("Unexpected error");
		}
	};

	return (
		<>
			<h2 className="scroll-m-20 border-b pb-2 md:text-5xl text-3xl font-semibold tracking-tight first:mt-0">
				Emergency Leaving
			</h2>
			<Card className="my-10 border-none shadow-none">
				<CardContent className="py-8 grid">
					<div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-3">
						<DatePicker onSelectDate={handleDateSelect} />
						<Input placeholder="Time" onChange={(e) => setTime(e.target.value)} />
					</div>

					<div className="grid-cols-1">
						<Textarea
							placeholder="Reasons"
							onChange={(e) => setReasons(e.target.value)}
						/>
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
		</>
	);
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/datePickerRange";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { toast } from "sonner";

export default function Page() {
	const [selectedRange, setSelectedRange] = useState(null);
	const [reasons, setReasons] = useState("");

	const handleRangeSelect = (range: any) => {
		setSelectedRange(range);
	};

	const handleSubmit = async () => {
		if (!selectedRange || !reasons) {
			return;
		}

		try {
			const userId = sessionStorage.getItem("user-id");

			const { data, error } = await supabase
				.from("holiday_leaves")
				.insert([{ user_id: userId, date_range: selectedRange, reason: reasons }]);
			toast.success("Inserted Request");
			if (error) {
				toast.error("Error inserting data");
				return;
			}
			setSelectedRange(null);
			setReasons("");
		} catch (error) {
			toast.error("Unexpected error");
		}
	};

	return (
		<>
			<h2 className="scroll-m-20 border-b pb-2 md:text-5xl text-3xl font-semibold tracking-tight first:mt-0">
				Holiday Leaving
			</h2>
			<Card className="my-10 border-none shadow-none">
				<CardContent className="py-8 grid">
					<div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
						<DatePickerWithRange onSelectRange={handleRangeSelect} />
					</div>

					<div className="grid-cols-1">
						<Textarea
							placeholder="Reasons"
							value={reasons}
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

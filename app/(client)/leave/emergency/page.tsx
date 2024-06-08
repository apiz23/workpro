"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/datePicker";

export default function Page() {
	const [selectedDate, setSelectedDate] = useState(null);

	const handleDateSelect = (range: any) => {
		setSelectedDate(range);
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
						<Input placeholder="Time" />
					</div>

					<div className="grid-cols-1">
						<Textarea placeholder="Reasons" />
					</div>
				</CardContent>
				<CardFooter className="flex justify-end">
					<Button className="inline-block bg-white hover:bg-slate-400 rounded border border-current px-8 text-sm font-medium text-indigo-600 hover:text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:text-indigo-500">
						Submit
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}

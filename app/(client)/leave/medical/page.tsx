"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/datePickerRange";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export default function Page() {
	const [selectedRange, setSelectedRange] = useState(null);
	const [selectedFile, setSelectedFile] = useState(null);
	const [medUrl, setMedUrl] = useState("");

	const handleRangeSelect = (range: any) => {
		setSelectedRange(range);
	};

	const handleFileChange = (event: any) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleSubmit = async () => {
		if (!selectedRange || !selectedFile) {
			return;
		}

		try {
			const uniqueId = uuidv4();
			const { data: fileData, error: fileError } = await supabase.storage
				.from("medical-certificate")
				.upload(uniqueId, selectedFile);

			if (fileError) {
				toast.error("Error uploading file");
				return;
			}

			const fileUrlResponse = await supabase.storage
				.from("public-bucket")
				.getPublicUrl(`medical-certificate/${fileData?.path}`);

			const fileUrl = uniqueId;

			const { data, error } = await supabase.from("medical_leaves").insert([
				{
					user_id: sessionStorage.getItem("user-id"),
					date_range: selectedRange,
					medical_certificate_url: fileUrl,
				},
			]);
			toast.success("Inserted Request");

			if (error) {
				toast.error("Error inserting data");
				return;
			}
			setMedUrl(fileUrl);
		} catch (error) {
			toast.error("Unexpected error");
		}
	};

	return (
		<>
			<h2 className="scroll-m-20 border-b pb-2 md:text-5xl text-3xl font-semibold tracking-tight first:mt-0">
				Medical Leaving
			</h2>
			<Card className="my-10 border-none shadow-none">
				<CardContent className="py-8 grid">
					<div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
						<DatePickerWithRange onSelectRange={handleRangeSelect} />
					</div>
					<div className="grid-cols-1">
						<Input
							type="file"
							placeholder="Upload Medical Certificate"
							onChange={handleFileChange}
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

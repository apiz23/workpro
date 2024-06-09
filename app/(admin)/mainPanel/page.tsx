"use client";

import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";

import supabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface HolidayLeave {
	id: number;
	user_id: string | null;
	date_range: string | null;
	reason: string | null;
	created_at: string;
}

interface MedicalLeave {
	id: number;
	user_id: string | null;
	date_range: string | null;
	medical_certificate_url: string | null;
	created_at: string;
}

interface EmergencyLeave {
	id: number;
	user_id: string | null;
	reason: string | null;
	created_at: string;
	time_left: string | null;
	date_leave: string | null;
}

export default function Page() {
	const [holidayLeaves, setHolidayLeaves] = useState<HolidayLeave[]>([]);
	const [medicalLeaves, setMedicalLeaves] = useState<MedicalLeave[]>([]);
	const [emergencyLeaves, setEmergencyLeaves] = useState<EmergencyLeave[]>([]);
	const [selectedTable, setSelectedTable] = useState("holiday");
	const [rejectReason, setRejectReason] = useState("");
	const router = useRouter();

	useEffect(() => {
		const fetchHolidayLeaves = async () => {
			try {
				const { data, error } = await supabase.from("holiday-leaves").select("*");

				if (error) {
					toast.error("Error fetching holiday leaves");
					return;
				}

				setHolidayLeaves(data);
			} catch (error) {
				toast.error("Unexpected error");
			}
		};

		const fetchMedicalLeaves = async () => {
			try {
				const { data, error } = await supabase.from("medical-leaves").select("*");

				if (error) {
					toast.error("Error fetching medical leaves");
					return;
				}

				setMedicalLeaves(data);
			} catch (error) {
				toast.error("Unexpected error");
			}
		};

		const fetchEmergencyLeaves = async () => {
			try {
				const { data, error } = await supabase.from("emergency-leaves").select("*");

				if (error) {
					toast.error("Error fetching emergency leaves");
					return;
				}

				setEmergencyLeaves(data);
			} catch (error) {
				toast.error("Unexpected error");
			}
		};

		fetchHolidayLeaves();
		fetchMedicalLeaves();
		fetchEmergencyLeaves();
	}, []);

	const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTable(event.target.value);
	};

	const handleExit = () => {
		sessionStorage.clear();
		router.push("/auth");
	};

	const formatDateRange = (dateRange: string | null) => {
		if (!dateRange) return "N/A";

		const parsedRange = JSON.parse(dateRange);
		const from = new Date(parsedRange.from)
			.toISOString()
			.slice(0, 16)
			.replace("T", " ");
		const to = new Date(parsedRange.to)
			.toISOString()
			.slice(0, 16)
			.replace("T", " ");
		return `${from} - ${to}`;
	};

	const handleApprove = async (
		id: number,
		tableName: string,
		status: number
	) => {
		try {
			const { error } = await supabase
				.from(tableName)
				.update({ status: status })
				.eq("id", id);

			if (error) {
				toast.error("Error updating holiday leave status");
				return;
			}
			toast.promise(
				new Promise((resolve) =>
					setTimeout(() => resolve({ name: "Sonner" }), 2000)
				),
				{
					loading: "Loading...",
					success: (data) => {
						return `Approved Request`;
					},
				}
			);
			const { data, error: fetchError } = await supabase
				.from(tableName)
				.select("*");

			if (fetchError) {
				toast.error("Error fetching holiday leaves after update");
				return;
			}

			setHolidayLeaves(data);
		} catch (error) {
			toast.error("Unexpected error:");
		}
	};

	const handleReject = async (
		id: number,
		tableName: string,
		status: number,
		rejectReason: string
	) => {
		try {
			const { error } = await supabase
				.from(tableName)
				.update({ status: status, reason_reject: rejectReason })
				.eq("id", id);

			if (error) {
				toast.error("Error updating holiday leave status");
				return;
			}
			toast.promise(
				new Promise((resolve) =>
					setTimeout(() => resolve({ name: "Sonner" }), 2000)
				),
				{
					loading: "Loading...",
					error: (data) => {
						return `Rejected Request`;
					},
				}
			);
			const { data, error: fetchError } = await supabase
				.from(tableName)
				.select("*");

			if (fetchError) {
				toast.error("Error fetching holiday leaves after update");
				return;
			}

			setHolidayLeaves(data);
		} catch (error) {
			toast.error("Unexpected error");
		}
	};

	const renderTable = () => {
		if (selectedTable === "holiday") {
			return (
				<Table>
					<TableCaption>Holiday Leaves List</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">ID</TableHead>
							<TableHead>User ID</TableHead>
							<TableHead>Date Range</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{holidayLeaves.map((leave) => (
							<TableRow
								key={leave.id}
								className={`${
									leave.status === 1
										? "bg-red-300"
										: leave.status === 0
										? "bg-green-100"
										: ""
								}`}
							>
								<TableCell className="font-medium">
									<Dialog>
										<DialogTrigger className="bg-black text-white py-2 rounded-lg px-3">
											{leave.id}
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Details</DialogTitle>
												<DialogDescription>
													<div className="p-2">User Id: {leave.user_id || "N/A"}</div>
													<div className="p-2">
														Date range: {formatDateRange(leave.date_range)}
													</div>
													<div className="p-2">Reasons: {leave.reason || "N/A"}</div>
													<div className="p-2">
														Created at:
														{new Date(leave.created_at).toLocaleString()}
													</div>
													<div className="mt-3" key={leave.id}>
														<Button
															variant="default"
															className="inline-block px-4 py-2 text-sm font-medium focus:relative"
															onClick={() => handleApprove(leave.id, "holiday-leaves", 1)}
														>
															Approve
														</Button>

														<Drawer>
															<DrawerTrigger className="inline-block px-4 py-2.5 text-sm font-medium text-white ms-5 bg-red-500 rounded-md focus:relative">
																Reject
															</DrawerTrigger>
															<DrawerContent className="max-w-2xl mx-auto">
																<DrawerHeader>
																	<DrawerTitle>Are you absolutely sure?</DrawerTitle>
																	<DrawerDescription className="mb-5">
																		This action cannot be undone.
																	</DrawerDescription>
																	<Input
																		placeholder="Reason to Reject"
																		value={rejectReason}
																		onChange={(e) => setRejectReason(e.target.value)}
																	/>
																</DrawerHeader>
																<DrawerFooter>
																	<Button
																		variant="destructive"
																		className="inline-block px-4 py-2 text-sm font-medium focus:relative"
																		onClick={() =>
																			handleReject(leave.id, "holiday-leaves", 0, rejectReason)
																		}
																	>
																		Confirm
																	</Button>
																	<DrawerClose>
																		<Button variant="outline" className="w-full">
																			Cancel
																		</Button>
																	</DrawerClose>
																</DrawerFooter>
															</DrawerContent>
														</Drawer>
													</div>
												</DialogDescription>
											</DialogHeader>
										</DialogContent>
									</Dialog>
								</TableCell>
								<TableCell>{leave.user_id || "N/A"}</TableCell>
								<TableCell>{formatDateRange(leave.date_range)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			);
		} else if (selectedTable === "medical") {
			return (
				<Table>
					<TableCaption>Medical Leaves List</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">ID</TableHead>
							<TableHead>User ID</TableHead>
							<TableHead>Date Range</TableHead>
							<TableHead>Created At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{medicalLeaves.map((leave) => (
							<TableRow
								key={leave.id}
								className={`${
									leave.status === 1
										? "bg-red-300"
										: leave.status === 0
										? "bg-green-100"
										: ""
								}`}
							>
								<TableCell className="font-medium">
									<Dialog>
										<DialogTrigger className="bg-black text-white py-2 rounded-lg px-3">
											{leave.id}
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Details</DialogTitle>
												<DialogDescription>
													<div className="p-2">User Id: {leave.user_id || "N/A"}</div>
													<div className="p-2">
														Date range: {formatDateRange(leave.date_range)}
													</div>
													<div className="p-2">
														Medical Certificate:
														{leave.medical_certificate_url ? (
															<Button className="ms-5">
																<a
																	href={leave.medical_certificate_url}
																	target="_blank"
																	rel="noopener noreferrer"
																>
																	View
																</a>
															</Button>
														) : (
															"N/A"
														)}
													</div>
													<div className="p-2">
														Created at:
														{new Date(leave.created_at).toLocaleString()}
													</div>
													<div className="mt-3">
														<Button
															variant="default"
															className="inline-block px-4 py-2 text-sm font-medium focus:relative"
															onClick={() => handleApprove(leave.id, "medical-leaves", 1)}
														>
															Approve
														</Button>
														<Drawer>
															<DrawerTrigger className="inline-block px-4 py-2.5 text-sm font-medium text-white ms-5 bg-red-500 rounded-md focus:relative">
																Reject
															</DrawerTrigger>
															<DrawerContent className="max-w-2xl mx-auto">
																<DrawerHeader>
																	<DrawerTitle>Are you absolutely sure?</DrawerTitle>
																	<DrawerDescription className="mb-5">
																		This action cannot be undone.
																	</DrawerDescription>
																	<Input
																		placeholder="Reason to Reject"
																		value={rejectReason}
																		onChange={(e) => setRejectReason(e.target.value)}
																	/>
																</DrawerHeader>
																<DrawerFooter>
																	<Button
																		variant="destructive"
																		className="inline-block px-4 py-2 text-sm font-medium focus:relative"
																		onClick={() =>
																			handleReject(leave.id, "medical-leaves", 0, rejectReason)
																		}
																	>
																		Confirm
																	</Button>
																	<DrawerClose>
																		<Button variant="outline" className="w-full">
																			Cancel
																		</Button>
																	</DrawerClose>
																</DrawerFooter>
															</DrawerContent>
														</Drawer>
													</div>
												</DialogDescription>
											</DialogHeader>
										</DialogContent>
									</Dialog>
								</TableCell>
								<TableCell>{leave.user_id || "N/A"}</TableCell>
								<TableCell>{formatDateRange(leave.date_range)}</TableCell>
								<TableCell>{new Date(leave.created_at).toLocaleString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			);
		} else if (selectedTable === "emergency") {
			return (
				<Table>
					<TableCaption>Emergency Leaves List</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">ID</TableHead>
							<TableHead>User ID</TableHead>
							<TableHead>Reason</TableHead>
							<TableHead>Time Left</TableHead>
							<TableHead>Date Leave</TableHead>
							<TableHead>Created At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{emergencyLeaves.map((leave) => (
							<TableRow
								key={leave.id}
								className={`${
									leave.status === 1
										? "bg-red-300"
										: leave.status === 0
										? "bg-green-100"
										: ""
								}`}
							>
								<TableCell className="font-medium">
									<Dialog>
										<DialogTrigger className="bg-black text-white py-2 rounded-lg px-3">
											{leave.id}
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Details</DialogTitle>
												<DialogDescription>
													<div className="p-2">User Id: {leave.user_id || "N/A"}</div>
													<div className="p-2">Date range: {leave.date_leave || "N/A"}</div>
													<div className="p-2">Time: {leave.time_left || "N/A"}</div>
													<div className="p-2">Reasons: {leave.reason || "N/A"}</div>
													<div className="p-2">
														Created at:
														{new Date(leave.created_at).toLocaleString()}
													</div>
													<div className="mt-3">
														<Button
															variant="default"
															className="inline-block px-4 py-2 text-sm font-medium focus:relative"
															onClick={() => handleApprove(leave.id, "emergency-leaves", 1)}
														>
															Approve
														</Button>

														<Drawer>
															<DrawerTrigger className="inline-block px-4 py-2.5 text-sm font-medium text-white ms-5 bg-red-500 rounded-md focus:relative">
																Reject
															</DrawerTrigger>
															<DrawerContent className="max-w-2xl mx-auto">
																<DrawerHeader>
																	<DrawerTitle>Are you absolutely sure?</DrawerTitle>
																	<DrawerDescription className="mb-5">
																		This action cannot be undone.
																	</DrawerDescription>
																	<Input
																		placeholder="Reason to Reject"
																		value={rejectReason}
																		onChange={(e) => setRejectReason(e.target.value)}
																	/>
																</DrawerHeader>
																<DrawerFooter>
																	<Button
																		variant="destructive"
																		className="inline-block px-4 py-2 text-sm font-medium focus:relative"
																		onClick={() =>
																			handleReject(leave.id, "emergency-leaves", 0, rejectReason)
																		}
																	>
																		Confirm
																	</Button>
																	<DrawerClose>
																		<Button variant="outline" className="w-full">
																			Cancel
																		</Button>
																	</DrawerClose>
																</DrawerFooter>
															</DrawerContent>
														</Drawer>
													</div>
												</DialogDescription>
											</DialogHeader>
										</DialogContent>
									</Dialog>
								</TableCell>
								<TableCell>{leave.user_id || "N/A"}</TableCell>
								<TableCell>{leave.reason || "N/A"}</TableCell>
								<TableCell>{leave.date_leave || "N/A"}</TableCell>
								<TableCell>{new Date(leave.created_at).toLocaleString()}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			);
		}
	};

	return (
		<>
			<div className="absolute top-0 right-0 flex justify-between items-center px-4 py-2">
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
					<LogOut className="h-6 w-6 hover:cursor-pointer" onClick={handleExit} />
				</button>
			</div>
			<h3 className="scroll-m-20 text-4xl mb-5 font-semibold tracking-tight">
				Leaves Table
			</h3>
			<div className="mb-5">
				<label
					htmlFor="table-select"
					className="block text-sm font-medium text-gray-900"
				>
					Select Leaves
				</label>
				<select
					id="table-select"
					value={selectedTable}
					onChange={handleTableChange}
					className="mt-1.5 w-full rounded-lg p-2.5 border-gray-300 bg-slate-200 text-gray-700 sm:text-sm"
				>
					<option value="holiday">Holiday Leaves</option>
					<option value="medical">Medical Leaves</option>
					<option value="emergency">Emergency Leaves</option>
				</select>
			</div>
			<ScrollArea className="h-fit rounded-md border p-4">
				{renderTable()}
			</ScrollArea>
		</>
	);
}

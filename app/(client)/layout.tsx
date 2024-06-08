import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navigation from "@/components/navigation";
import AuthProvider from "@/components/sessionProvider";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
	title: "Work Pro",
	description: "Generated by create next app",
	icons: {
		icon: [
			{
				url: "/logo.png",
				href: "/logo.png",
			},
		],
	},
};
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className={inter.className}>
					<Navigation />
					<div className="mx-auto max-w-screen-lg px-4 py-44 h-screen">
						{children}
					</div>
				</body>
			</AuthProvider>
		</html>
	);
}

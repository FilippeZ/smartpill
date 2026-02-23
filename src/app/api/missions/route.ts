import { NextResponse } from "next/server";

const missions = [
    { id: "PX-992-01", date: "Oct 24, 2023", time: "08:14 AM UTC", duration: "07:22:12", finding: "2 Polyps Detected (Type II)", status: "warning" },
    { id: "PX-844-09", date: "Oct 23, 2023", time: "02:45 PM UTC", duration: "06:42:15", finding: "Normal Scan - No Abnormalities", status: "success" },
    { id: "PX-102-55", date: "Oct 21, 2023", time: "11:30 AM UTC", duration: "08:01:44", finding: "Suspected Ulceration (Lower G.I.)", status: "error" },
    { id: "PX-771-42", date: "Oct 19, 2023", time: "09:12 AM UTC", duration: "05:55:01", finding: "Normal Scan - High Clarity", status: "success" },
];

export async function GET() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return NextResponse.json(missions);
}

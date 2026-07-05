import axiosInstance from "@/auth-client/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const endpoint = request.nextUrl.searchParams.get("url");

        const token = request.headers.get("authorization");

        const response = await axiosInstance.get(endpoint!, {
            headers: {
                Authorization: token ?? "",
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            error.response?.data ?? { message: "Internal Server Error" },
            {
                status: error.response?.status ?? 500,
            },
        );
    }
}
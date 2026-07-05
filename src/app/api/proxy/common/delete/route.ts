import axiosInstance from "@/auth-client/axios";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await axiosInstance.delete(body.url, {
            headers: {
                Authorization: request.headers.get("authorization") ?? "",
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
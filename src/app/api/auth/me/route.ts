import axiosInstance from "@/auth-client/axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization");

        const response = await axiosInstance.get("/user/profile", {
            headers: {
                Authorization: token,
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            error.response?.data || {
                message: "Internal Server Error",
            },
            {
                status: error.response?.status || 500,
            },
        );
    }
}
/*
 * Created on Sat Dec 02 2023
 * Author: Connor Doman
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UploadStatusProps {
    filename: string;
}

export const UploadStatus = ({ filename }: UploadStatusProps) => {
    const router = useRouter();
    const [status, setStatus] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>("Processing...");

    const checkStatus = async () => {
        if (status) return;

        try {
            const response = await fetch(`/api/video/status?filename=${filename}`);

            if (response.status === 404) {
                setStatus(true);
                setStatusMessage("File not found.");
                return;
            }

            if (response.ok) {
                const json = await response.json();
                if (json.message === "True") {
                    setStatusMessage("Processing complete!");
                    router.push(`/upload/review/${filename}`);
                }
            }
        } catch (err: any) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        const interval = setTimeout(() => {
            checkStatus();
        }, 5000);
        if (status) clearTimeout(interval);
        return () => clearTimeout(interval);
    }, []);

    return (
        <div>
            <p>Status: {statusMessage}</p>
        </div>
    );
};

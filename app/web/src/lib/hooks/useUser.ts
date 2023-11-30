/*
 * Created on Sun Nov 19 2023
 * Author: Connor Doman
 */

import { JSONResponse } from "@lib/json";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((res) => res.json());

export default function useUser() {
    const { data, error, mutate } = useSWR<JSONResponse>("/api/auth/session", fetcher);

    const user = data?.data;
    const loading = !data && !error;

    return {
        user,
        loading,
        error,
        mutate,
    };
}

/*
 * Copyright [2023] [Privacypal Authors]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { JSONResponse } from "@lib/response";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => res.json());

export default function useUser() {
  const { data, error, mutate } = useSWR<JSONResponse>(
    "/api/auth/session",
    fetcher,
  );

  const user = data?.data;
  const loading = !data && !error;

  return {
    user,
    loading,
    error,
    mutate,
  };
}

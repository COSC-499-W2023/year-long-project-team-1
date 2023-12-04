/*
 * Created on Sun Nov 26 2023
 * Author: Connor Doman
 */

import { UploadStatus } from "@components/upload/UploadStatus";

export default async function VideoReviewPage({ params }: { params: { id: string } }) {
    return (
        <main>
            <UploadStatus filename={params.id} />
        </main>
    );
}

/*
 * Created on Sun Nov 26 2023
 * Author: Connor Doman
 */

import VideoReview from "@components/VideoReview";

export default async function VideoReviewPage({ params }: { params: { id: string } }) {
    return (
        <main>
            <VideoReview videoId={params.id} />
        </main>
    );
}

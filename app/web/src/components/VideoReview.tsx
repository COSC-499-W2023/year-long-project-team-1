/*
 * Created on Mon Nov 27 2023
 * Author: Connor Doman
 */
"use client";

import { ActionList, ActionListItem, Button, Card, CardBody, CardTitle } from "@patternfly/react-core";
import { CheckIcon, TimesIcon } from "@patternfly/react-icons";
import Link from "next/link";
import style from "@assets/style";
import { useRouter } from "next/navigation";

export const videoReviewStyle = {
    ...style,
    videoPlayer: {
        width: "100%",
        aspectRatio: "16 / 9",
        backgroundColor: "black",
        margin: "1rem 0",
        borderRadius: "0.25rem",
    },
};

interface VideoReviewProps {
    videoId: string;
}

export const VideoReview = ({ videoId }: VideoReviewProps) => {
    const router = useRouter();

    const handleAccept = () => {
        // TODO: upload video to S3 with Server Action
        alert("TODO: upload video to S3 with Server Action");
    };

    const handleReject = () => {
        console.log("helloooo?");
        router.push("/upload");
    };

    return (
        <Card style={style.card}>
            <CardTitle component="h1">Review Your Submission</CardTitle>
            <CardBody>
                <video controls autoPlay={false} style={videoReviewStyle.videoPlayer}>
                    <source src={`/api/video/review?file=${videoId}.mp4`} />
                </video>
                <ActionList style={style.actionList}>
                    <ActionListItem>
                        <Button icon={<CheckIcon />} onClick={() => handleAccept()}>
                            This looks good
                        </Button>
                    </ActionListItem>
                    <ActionListItem>
                        <Button variant="danger" icon={<TimesIcon />} onClick={() => handleReject()}>
                            Cancel
                        </Button>
                    </ActionListItem>
                </ActionList>
            </CardBody>
        </Card>
    );
};

export default VideoReview;

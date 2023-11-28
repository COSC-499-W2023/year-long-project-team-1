/*
 * Created on Mon Nov 27 2023
 * Author: Connor Doman
 */
"use client";

import {
    ActionList,
    ActionListItem,
    Button,
    Card,
    CardBody,
    CardTitle,
    HelperText,
    HelperTextItem,
    TextInput,
    ValidatedOptions,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import Link from "next/link";
import style from "@assets/style";

export const VideoReview = () => {
    return (
        <Card style={style.card}>
            <CardTitle component="h1">Review Your Submission</CardTitle>
            <CardBody>
                <video>
                    <source src="" />
                </video>
                <ActionList style={style.actionList}>
                    <ActionListItem>
                        <Button>This looks good</Button>
                    </ActionListItem>
                    <ActionListItem>
                        <Link href="#signupwithcode">
                            <Button variant="danger">Cancel</Button>
                        </Link>
                    </ActionListItem>
                </ActionList>
            </CardBody>
        </Card>
    );
};

export default VideoReview;

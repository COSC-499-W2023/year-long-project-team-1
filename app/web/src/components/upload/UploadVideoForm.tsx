"use client";
import { useState } from "react";
import { JSONResponse } from "@lib/response";
import {
    Button,
    Stack,
    StackItem,
    Grid,
    GridItem,
    Card,
    CardTitle,
    CardBody,
    ActionList,
    ActionListItem,
} from "@patternfly/react-core";
import { useRouter } from "next/navigation";
import style from "@assets/style";
import { encode } from "punycode";

export const UploadVideoForm = () => {
    const router = useRouter();

    const [file, setFile] = useState<File>();
    const [filename, setFilename] = useState<string>("");
    const [isPicked, setIsPicked] = useState<boolean>(false);
    const [responseData, setResponseData] = useState<JSONResponse>();
    const acceptedMimeTypes = ["video/mp4", "video/x-msvideo", "video/quicktime"]; // mp4, avi, mov

    const onSubmitClick = async (e: any) => {
        if (!file || !isPicked) {
            alert("No file selected!");
            return;
        }

        try {
            const formData = new FormData();
            formData.set("file", file);

            const response = await fetch("/api/video/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                console.error("Error in upload response.");
                throw Error(await response.text());
            } else if (response.status === 200) {
                const json = await response.clone().json();

                setResponseData(json);

                setTimeout(() => {
                    router.push(`/upload/status/${encodeURIComponent(json.data?.filePath)}`);
                }, 2000);
            }
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const onFileChanged = (e: any) => {
        const f = e.target.files?.[0] as File;
        if (!acceptedMimeTypes.includes(f.type)) {
            alert("You must select an *.mp4, *.avi, or *.mov file");
            return;
        }
        setFile(f);
        setIsPicked(true);
        setFilename(f.name);
    };

    return (
        <Card style={style.card}>
            <CardTitle component="h1">Upload a Video</CardTitle>
            <CardBody>
                {responseData?.data?.success ? (
                    <p className="success">Upload successful. Redirecting...</p>
                ) : (
                    <>
                        <input
                            className="file-input"
                            type="file"
                            alt="file upload"
                            accept={acceptedMimeTypes.toString()}
                            onChange={onFileChanged}
                        />
                        <ActionList style={style.actionList}>
                            <ActionListItem>
                                <Button variant="primary" onClick={onSubmitClick}>
                                    Submit video
                                </Button>
                            </ActionListItem>
                            <ActionListItem>
                                <Button variant="danger" isDisabled={true}>
                                    Record video
                                </Button>
                            </ActionListItem>
                        </ActionList>
                    </>
                )}
            </CardBody>
        </Card>
    );
};
export default UploadVideoForm;

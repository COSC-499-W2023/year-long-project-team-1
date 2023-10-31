"use client";
import { useState } from "react";
import { JSONResponse } from "@lib/json";
import { Button, Stack, StackItem, Grid, GridItem } from "@patternfly/react-core";

export const UploadVideoForm = () => {
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

            const json = await response.clone().json();

            if (!response.ok) {
                console.error("Error in upload response.");
                throw Error(await response.text());
            }

            setResponseData(json);
        } catch (err: any) {
            console.error(err.message);
        }
    };

    const onFileChanged = (e: any) => {
        const f = e.target.files?.[0];
        if (!acceptedMimeTypes.includes(f.type)) {
            alert("You must select an *.mp4, *.avi, or *.mov file");
            return;
        }
        setFile(f);
        setIsPicked(true);
        setFilename(f.name);
    };

    return (
        <Stack>
            <StackItem>
                {/* <FileUpload
					id="videoupload"
					filename={filename}
					onFileInputChange={(e: DropEvent, f: File) => {
						setFile(f);
						setIsPicked(true);
						setFilename(f.name);
					}}
					onClearClick={() => {
						setFile(undefined);
						setFilename("");
						setIsPicked(false);
					}}
					dropzoneProps={{
						accept: {
							"video/mp4": [".mp4"],
							"video/x-msvideo": [".avi"],
							"video/quicktime": [".mov"],
						},
						onDropRejected: (
							fileRejectionList,
							event: DropEvent
						) => {
							alert(
								"Invalid file type! Must be a *.mp4, *.avi, or *.mov file."
							);
							// setFile(undefined);
							setFilename("");
							setIsPicked(false);
						},
					}}
				/> */}
                <input id="videoupload" type="file" accept={acceptedMimeTypes.toString()} onChange={onFileChanged} />
                <text>{filename}</text>
            </StackItem>
            <StackItem>
                <Grid>
                    <GridItem span={4}></GridItem>
                    <GridItem span={4}>
                        <Button
                            variant="danger"
                            onClick={(e) => {
                                alert("Not implemented yet!");
                            }}>
                            Record video
                        </Button>
                    </GridItem>
                    <GridItem span={4}>
                        <Button variant="primary" onClick={onSubmitClick}>
                            Submit video
                        </Button>
                    </GridItem>
                </Grid>
            </StackItem>
        </Stack>
    );
};
export default UploadVideoForm;
